from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select, desc, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.models.defense import DefenseRule
from app.models.event import SecurityEvent
from app.security import require_role

router = APIRouter(prefix="/blue", tags=["Blue Team Zone"])

class DefenseRuleCreate(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    stage: str = "INPUT_FILTER"  # "INPUT_FILTER" or "OUTPUT_FILTER"
    rule_type: str = "REGEX"  # "REGEX", "KEYWORD", "CANARY_GUARD", "ENTROPY"
    pattern: str
    action: str = "BLOCK"  # "BLOCK", "SANITIZE", "ALERT"
    severity: str = "HIGH"  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    owasp_category: str = "LLM01: Prompt Injection"
    is_active: bool = True

class DefenseRuleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    pattern: Optional[str] = None
    action: Optional[str] = None
    severity: Optional[str] = None
    is_active: Optional[bool] = None

@router.get("/defenses")
async def list_defenses(
    current_user: User = Depends(require_role(["blue_operator", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(DefenseRule).order_by(DefenseRule.created_at.desc())
    result = await db.execute(stmt)
    rules = result.scalars().all()
    return rules

@router.post("/defenses")
async def create_defense(
    req: DefenseRuleCreate,
    current_user: User = Depends(require_role(["blue_operator", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    # Check if ID exists
    stmt = select(DefenseRule).where(DefenseRule.id == req.id)
    res = await db.execute(stmt)
    if res.scalars().first():
        raise HTTPException(status_code=400, detail=f"Defense rule ID '{req.id}' already exists.")

    rule = DefenseRule(
        id=req.id,
        name=req.name,
        description=req.description,
        stage=req.stage,
        rule_type=req.rule_type,
        pattern=req.pattern,
        action=req.action,
        severity=req.severity,
        owasp_category=req.owasp_category,
        is_active=req.is_active
    )
    db.add(rule)
    await db.commit()
    await db.refresh(rule)
    return rule

@router.put("/defenses/{rule_id}")
async def update_defense(
    rule_id: str,
    req: DefenseRuleUpdate,
    current_user: User = Depends(require_role(["blue_operator", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(DefenseRule).where(DefenseRule.id == rule_id)
    res = await db.execute(stmt)
    rule = res.scalars().first()
    if not rule:
        raise HTTPException(status_code=404, detail="Defense rule not found.")

    if req.name is not None:
        rule.name = req.name
    if req.description is not None:
        rule.description = req.description
    if req.pattern is not None:
        rule.pattern = req.pattern
    if req.action is not None:
        rule.action = req.action
    if req.severity is not None:
        rule.severity = req.severity
    if req.is_active is not None:
        rule.is_active = req.is_active

    await db.commit()
    await db.refresh(rule)
    return rule

@router.delete("/defenses/{rule_id}")
async def delete_defense(
    rule_id: str,
    current_user: User = Depends(require_role(["blue_operator", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(DefenseRule).where(DefenseRule.id == rule_id)
    res = await db.execute(stmt)
    rule = res.scalars().first()
    if not rule:
        raise HTTPException(status_code=404, detail="Defense rule not found.")
    await db.delete(rule)
    await db.commit()
    return {"status": "DELETED", "id": rule_id}

@router.get("/threat-feed")
async def get_sanitized_threat_feed(
    limit: int = 50,
    current_user: User = Depends(require_role(["blue_operator", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns sanitized threat feed for Blue Team.
    Strictly isolated: Blue sees only sanitized tokenized snippets and defense metadata.
    RAW attack payloads and Red operator IDs are NEVER exposed to Blue.
    """
    stmt = (
        select(SecurityEvent)
        .order_by(desc(SecurityEvent.timestamp))
        .limit(limit)
    )
    result = await db.execute(stmt)
    events = result.scalars().all()

    return [
        {
            "id": e.id,
            "timestamp": e.timestamp.isoformat(),
            "sandbox_id": e.sandbox_id,
            "stage": e.stage,
            "decision": e.decision,
            "triggered_rule_id": e.triggered_rule_id,
            "owasp_category": e.owasp_category,
            "severity": e.severity,
            "sanitized_snippet": e.sanitized_snippet,  # Safe tokenized view
            "latency_ms": e.latency_ms
            # Note: raw_payload and actor_id are deliberately omitted!
        }
        for e in events
    ]

@router.get("/metrics")
async def get_blue_metrics(
    current_user: User = Depends(require_role(["blue_operator", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    """
    Aggregates defense statistics for Blue dashboard.
    """
    # Total events
    stmt_total = select(func.count(SecurityEvent.id))
    res_total = await db.execute(stmt_total)
    total_events = res_total.scalar() or 0

    # Total blocks
    stmt_blocks = select(func.count(SecurityEvent.id)).where(SecurityEvent.decision == "BLOCK")
    res_blocks = await db.execute(stmt_blocks)
    total_blocks = res_blocks.scalar() or 0

    block_rate = round((total_blocks / total_events * 100), 1) if total_events > 0 else 0.0

    # Group by OWASP category
    stmt_cats = (
        select(SecurityEvent.owasp_category, func.count(SecurityEvent.id))
        .group_by(SecurityEvent.owasp_category)
    )
    res_cats = await db.execute(stmt_cats)
    category_breakdown = [
        {"category": cat or "Unclassified", "count": count}
        for cat, count in res_cats.all()
    ]

    # Defense rules trigger counts
    stmt_rules = select(DefenseRule.name, DefenseRule.trigger_count).order_by(desc(DefenseRule.trigger_count)).limit(6)
    res_rules = await db.execute(stmt_rules)
    rule_stats = [
        {"name": name, "triggers": count}
        for name, count in res_rules.all()
    ]

    return {
        "total_events": total_events,
        "total_blocks": total_blocks,
        "block_rate": block_rate,
        "category_breakdown": category_breakdown,
        "top_triggered_rules": rule_stats,
        "estimated_false_positive_rate": 0.012
    }
