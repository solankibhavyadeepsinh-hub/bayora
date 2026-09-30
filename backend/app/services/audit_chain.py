import hashlib
import json
from datetime import datetime, timezone
from typing import Dict, Any, List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit import AuditBlock

GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

def utc_now_str():
    return datetime.now(timezone.utc).isoformat()

class AuditChainService:
    """
    Cryptographic SHA-256 append-only ledger for non-repudiation audit & evidence.
    Every event block links cryptographically to the preceding block's hash.
    """

    async def append_event_block(
        self,
        db: AsyncSession,
        event_id: str,
        action_type: str,
        actor_role: str,
        actor_id: str,
        payload_data: Dict[str, Any]
    ) -> AuditBlock:
        stmt = select(AuditBlock).order_by(desc(AuditBlock.block_index)).limit(1)
        result = await db.execute(stmt)
        last_block = result.scalars().first()

        new_index = (last_block.block_index + 1) if last_block else 0
        prev_hash = last_block.block_hash if last_block else GENESIS_HASH
        
        now = datetime.now(timezone.utc)
        timestamp_str = now.isoformat()

        # Deterministic payload hashing
        canonical_payload = json.dumps(payload_data, sort_keys=True)
        payload_sha256 = hashlib.sha256(canonical_payload.encode("utf-8")).hexdigest()
        
        # Salted actor ID hash
        actor_id_hash = hashlib.sha256(f"bayora-actor:{actor_id}".encode("utf-8")).hexdigest()

        # Compute chain hash
        block_hash = AuditBlock.compute_hash(
            block_index=new_index,
            timestamp_str=timestamp_str,
            event_id=event_id,
            action_type=action_type,
            payload_sha256=payload_sha256,
            prev_block_hash=prev_hash
        )

        audit_block = AuditBlock(
            block_index=new_index,
            timestamp=now,
            timestamp_str=timestamp_str,
            event_id=event_id,
            action_type=action_type,
            actor_role=actor_role,
            actor_id_hash=actor_id_hash,
            payload_sha256=payload_sha256,
            prev_block_hash=prev_hash,
            block_hash=block_hash,
            metadata_json=canonical_payload,
            verified=True
        )

        db.add(audit_block)
        await db.commit()
        await db.refresh(audit_block)
        return audit_block

    async def verify_integrity(self, db: AsyncSession) -> Dict[str, Any]:
        stmt = select(AuditBlock).order_by(AuditBlock.block_index.asc())
        result = await db.execute(stmt)
        blocks: List[AuditBlock] = list(result.scalars().all())

        if not blocks:
            return {
                "status": "VALID",
                "total_blocks": 0,
                "verified_blocks": 0,
                "tamper_detected": False,
                "chain_head": GENESIS_HASH,
                "verification_timestamp": utc_now_str(),
                "details": "Chain is empty (no blocks recorded yet)."
            }

        expected_prev_hash = GENESIS_HASH
        for idx, block in enumerate(blocks):
            if block.block_index != idx:
                return {
                    "status": "CORRUPTED",
                    "tamper_detected": True,
                    "failure_type": "INDEX_SEQUENCE_DISCONTINUITY",
                    "corrupted_block_index": block.block_index,
                    "expected_index": idx,
                    "total_blocks": len(blocks),
                    "verified_blocks": idx,
                    "verification_timestamp": utc_now_str(),
                }

            if block.prev_block_hash != expected_prev_hash:
                return {
                    "status": "CORRUPTED",
                    "tamper_detected": True,
                    "failure_type": "PREV_HASH_MISMATCH",
                    "corrupted_block_index": block.block_index,
                    "expected_prev_hash": expected_prev_hash,
                    "actual_prev_hash": block.prev_block_hash,
                    "total_blocks": len(blocks),
                    "verified_blocks": idx,
                    "verification_timestamp": utc_now_str(),
                }

            canonical_payload = json.dumps(json.loads(block.metadata_json), sort_keys=True)
            recomputed_payload_hash = hashlib.sha256(canonical_payload.encode("utf-8")).hexdigest()
            
            recomputed_block_hash = AuditBlock.compute_hash(
                block_index=block.block_index,
                timestamp_str=block.timestamp_str,
                event_id=block.event_id,
                action_type=block.action_type,
                payload_sha256=recomputed_payload_hash,
                prev_block_hash=block.prev_block_hash
            )

            if recomputed_block_hash != block.block_hash:
                return {
                    "status": "CORRUPTED",
                    "tamper_detected": True,
                    "failure_type": "BLOCK_HASH_TAMPERED",
                    "corrupted_block_index": block.block_index,
                    "expected_hash": recomputed_block_hash,
                    "stored_hash": block.block_hash,
                    "total_blocks": len(blocks),
                    "verified_blocks": idx,
                    "verification_timestamp": utc_now_str(),
                }

            expected_prev_hash = block.block_hash

        return {
            "status": "VALID",
            "tamper_detected": False,
            "total_blocks": len(blocks),
            "verified_blocks": len(blocks),
            "chain_head": blocks[-1].block_hash,
            "genesis_hash": GENESIS_HASH,
            "verification_timestamp": utc_now_str(),
            "seal": hashlib.sha256(f"bayora-audit-seal:{blocks[-1].block_hash}:{len(blocks)}".encode()).hexdigest(),
            "details": f"All {len(blocks)} blocks cryptographically verified with unbroken SHA-256 continuity."
        }

audit_chain_service = AuditChainService()
