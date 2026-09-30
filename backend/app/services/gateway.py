import time
import uuid
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.user import User
from app.models.sandbox import Sandbox
from app.models.defense import DefenseRule
from app.models.attack import AttackRecord
from app.models.event import SecurityEvent
from app.services.mock_llm import mock_llm_engine
from app.services.defense_engine import defense_engine
from app.services.audit_chain import audit_chain_service
from app.services.event_stream import event_broadcaster

class GatewayPipelineService:
    """
    Client LLM Gateway Pipeline:
    auth → policy → rate limit/quota → Blue input filters → LLM → Blue output filters → event → audit log.
    
    Strict Dual-Blind Isolation:
    - Red sees only model responses and a generic "blocked" message, NEVER which defense fired.
    - Blue sees only sanitized events, NEVER raw attack payloads.
    """

    async def execute_request(
        self,
        db: AsyncSession,
        user: User,
        sandbox_id: str,
        prompt: str,
        campaign_id: Optional[str] = None,
        attack_category: str = "Direct Prompt Injection"
    ) -> Dict[str, Any]:
        start_time = time.time()
        event_id = str(uuid.uuid4())

        # STAGE 1 & 2: AUTH & POLICY
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Operator account deactivated.")
        
        if user.role not in ["red_operator", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Zone Policy Violation: Only Red Team operators or Administrators may submit evaluation payloads."
            )

        # STAGE 3: QUOTA & RATE LIMIT
        stmt_sbx = select(Sandbox).where(Sandbox.id == sandbox_id)
        result_sbx = await db.execute(stmt_sbx)
        sandbox = result_sbx.scalars().first()
        if not sandbox:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Target sandbox '{sandbox_id}' not found.")

        if not sandbox.is_active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Target sandbox is offline.")

        if sandbox.current_tokens_used >= sandbox.quota_tokens_daily:
            latency_ms = (time.time() - start_time) * 1000
            event = SecurityEvent(
                id=event_id,
                sandbox_id=sandbox_id,
                actor_id=user.id,
                actor_role=user.role,
                stage="QUOTA",
                decision="BLOCK",
                owasp_category="LLM04: Model Denial of Service",
                severity="MEDIUM",
                raw_payload=prompt,
                sanitized_snippet="[QUOTA LIMIT EXCEEDED]",
                response_preview="Quota limit reached for sandbox.",
                latency_ms=latency_ms
            )
            db.add(event)
            await db.commit()
            return {
                "status": "BLOCKED",
                "model_response": "Request blocked: Sandbox token quota exceeded.",
                "latency_ms": round(latency_ms, 2)
            }

        # STAGE 4: BLUE INPUT FILTERS
        stmt_rules = select(DefenseRule).where(DefenseRule.is_active == True)
        result_rules = await db.execute(stmt_rules)
        all_rules = list(result_rules.scalars().all())

        is_blocked, triggered_rule, action, sanitized_snippet = defense_engine.evaluate_input_rules(
            rules=all_rules,
            prompt=prompt
        )

        if is_blocked:
            latency_ms = (time.time() - start_time) * 1000
            
            if triggered_rule:
                triggered_rule.trigger_count += 1
                db.add(triggered_rule)

            sec_event = SecurityEvent(
                id=event_id,
                sandbox_id=sandbox_id,
                actor_id=user.id,
                actor_role=user.role,
                stage="BLUE_INPUT_FILTER",
                decision="BLOCK",
                triggered_rule_id=triggered_rule.id if triggered_rule else "INTERNAL_GUARD",
                owasp_category=triggered_rule.owasp_category if triggered_rule else "LLM01: Prompt Injection",
                severity=triggered_rule.severity if triggered_rule else "HIGH",
                raw_payload=prompt,
                sanitized_snippet=sanitized_snippet,
                response_preview="Request blocked by security policy.",
                latency_ms=latency_ms
            )
            db.add(sec_event)

            attack_rec = AttackRecord(
                campaign_id=campaign_id,
                operator_id=user.id,
                target_sandbox_id=sandbox_id,
                prompt_payload=prompt,
                attack_category=attack_category,
                status="BLOCKED",
                model_response="Request blocked by security policy.",
                latency_ms=int(latency_ms)
            )
            db.add(attack_rec)

            await db.commit()
            await audit_chain_service.append_event_block(
                db=db,
                event_id=event_id,
                action_type="GATEWAY_INPUT_BLOCK",
                actor_role=user.role,
                actor_id=user.id,
                payload_data={
                    "event_id": event_id,
                    "sandbox_id": sandbox_id,
                    "decision": "BLOCK",
                    "stage": "BLUE_INPUT_FILTER",
                    "severity": triggered_rule.severity if triggered_rule else "HIGH"
                }
            )

            await event_broadcaster.broadcast({
                "id": event_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "sandbox_id": sandbox_id,
                "actor_role": user.role,
                "stage": "BLUE_INPUT_FILTER",
                "decision": "BLOCK",
                "owasp_category": triggered_rule.owasp_category if triggered_rule else "LLM01: Prompt Injection",
                "severity": triggered_rule.severity if triggered_rule else "HIGH",
                "sanitized_snippet": sanitized_snippet,
                "latency_ms": round(latency_ms, 2)
            })

            return {
                "id": attack_rec.id,
                "status": "BLOCKED",
                "model_response": "Request blocked by security policy.",
                "latency_ms": round(latency_ms, 2)
            }

        # STAGE 5: CLIENT LLM EXECUTION
        llm_out = await mock_llm_engine.generate_response(
            model_id=sandbox.target_model,
            prompt=prompt,
            system_prompt=sandbox.system_prompt or ""
        )
        model_raw_text = llm_out["response"]
        tokens_used = llm_out["tokens"]
        sandbox.current_tokens_used += tokens_used

        # STAGE 6: BLUE OUTPUT FILTERS
        out_blocked, out_rule, sanitized_output = defense_engine.evaluate_output_rules(
            rules=all_rules,
            output_text=model_raw_text,
            canary_token=sandbox.canary_token or ""
        )

        latency_ms = (time.time() - start_time) * 1000

        if out_blocked:
            if out_rule:
                out_rule.trigger_count += 1
                db.add(out_rule)

            sec_event = SecurityEvent(
                id=event_id,
                sandbox_id=sandbox_id,
                actor_id=user.id,
                actor_role=user.role,
                stage="BLUE_OUTPUT_FILTER",
                decision="BLOCK",
                triggered_rule_id=out_rule.id if out_rule else "CANARY_LEAK_GUARD",
                owasp_category="LLM02: Sensitive Information Disclosure",
                severity="CRITICAL",
                raw_payload=prompt,
                sanitized_snippet="[CONFIDENTIAL_OUTPUT_LEAK_PREVENTED]",
                response_preview="Request blocked by output security policy.",
                latency_ms=latency_ms,
                tokens_consumed=tokens_used
            )
            db.add(sec_event)

            attack_rec = AttackRecord(
                campaign_id=campaign_id,
                operator_id=user.id,
                target_sandbox_id=sandbox_id,
                prompt_payload=prompt,
                attack_category=attack_category,
                status="BLOCKED",
                model_response="Request blocked by output security policy.",
                latency_ms=int(latency_ms)
            )
            db.add(attack_rec)
            await db.commit()

            await audit_chain_service.append_event_block(
                db=db,
                event_id=event_id,
                action_type="GATEWAY_OUTPUT_BLOCK",
                actor_role=user.role,
                actor_id=user.id,
                payload_data={
                    "event_id": event_id,
                    "sandbox_id": sandbox_id,
                    "decision": "BLOCK",
                    "stage": "BLUE_OUTPUT_FILTER",
                    "severity": "CRITICAL"
                }
            )

            await event_broadcaster.broadcast({
                "id": event_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "sandbox_id": sandbox_id,
                "actor_role": user.role,
                "stage": "BLUE_OUTPUT_FILTER",
                "decision": "BLOCK",
                "owasp_category": "LLM02: Sensitive Information Disclosure",
                "severity": "CRITICAL",
                "sanitized_snippet": "[CONFIDENTIAL_OUTPUT_LEAK_PREVENTED]",
                "latency_ms": round(latency_ms, 2)
            })

            return {
                "id": attack_rec.id,
                "status": "BLOCKED",
                "model_response": "Request blocked by output security policy.",
                "latency_ms": round(latency_ms, 2)
            }

        # STAGE 7 & 8: SUCCESS EVENT & AUDIT HASH CHAIN
        sec_event = SecurityEvent(
            id=event_id,
            sandbox_id=sandbox_id,
            actor_id=user.id,
            actor_role=user.role,
            stage="LLM_EXECUTION",
            decision="ALLOW",
            owasp_category="BENIGN_OR_UNINTERCEPTED",
            severity="LOW",
            raw_payload=prompt,
            sanitized_snippet=f"[SAFE_INFERENCE: tokens={tokens_used}]",
            response_preview=sanitized_output[:120],
            latency_ms=latency_ms,
            tokens_consumed=tokens_used
        )
        db.add(sec_event)

        attack_rec = AttackRecord(
            campaign_id=campaign_id,
            operator_id=user.id,
            target_sandbox_id=sandbox_id,
            prompt_payload=prompt,
            attack_category=attack_category,
            status="SUCCESS",
            model_response=sanitized_output,
            latency_ms=int(latency_ms)
        )
        db.add(attack_rec)
        await db.commit()

        await audit_chain_service.append_event_block(
            db=db,
            event_id=event_id,
            action_type="GATEWAY_COMPLETION",
            actor_role=user.role,
            actor_id=user.id,
            payload_data={
                "event_id": event_id,
                "sandbox_id": sandbox_id,
                "decision": "ALLOW",
                "tokens": tokens_used,
                "latency_ms": latency_ms
            }
        )

        await event_broadcaster.broadcast({
            "id": event_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "sandbox_id": sandbox_id,
            "actor_role": user.role,
            "stage": "LLM_EXECUTION",
            "decision": "ALLOW",
            "owasp_category": "BENIGN_OR_UNINTERCEPTED",
            "severity": "LOW",
            "sanitized_snippet": f"[SAFE_INFERENCE: tokens={tokens_used}]",
            "latency_ms": round(latency_ms, 2)
        })

        return {
            "id": attack_rec.id,
            "status": "SUCCESS",
            "model_response": sanitized_output,
            "latency_ms": round(latency_ms, 2),
            "tokens": tokens_used
        }

gateway_pipeline_service = GatewayPipelineService()
