from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.models.audit import AuditBlock
from app.security import require_role
from app.services.audit_chain import audit_chain_service

router = APIRouter(prefix="/audit", tags=["Audit & Evidence Zone"])

@router.get("/blocks")
async def get_audit_blocks(
    limit: int = 100,
    current_user: User = Depends(require_role(["auditor", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(AuditBlock).order_by(desc(AuditBlock.block_index)).limit(limit)
    res = await db.execute(stmt)
    blocks = res.scalars().all()

    return [
        {
            "block_index": b.block_index,
            "timestamp": b.timestamp_str,
            "event_id": b.event_id,
            "action_type": b.action_type,
            "actor_role": b.actor_role,
            "actor_id_hash": b.actor_id_hash,
            "payload_sha256": b.payload_sha256,
            "prev_block_hash": b.prev_block_hash,
            "block_hash": b.block_hash,
            "metadata_json": b.metadata_json,
            "verified": b.verified
        }
        for b in blocks
    ]

@router.post("/verify")
async def verify_chain_integrity(
    current_user: User = Depends(require_role(["auditor", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    verification_report = await audit_chain_service.verify_integrity(db)
    return verification_report

@router.post("/simulate-tamper")
async def simulate_chain_tamper(
    block_index: int = 1,
    current_user: User = Depends(require_role(["auditor", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(AuditBlock).where(AuditBlock.block_index == block_index)
    res = await db.execute(stmt)
    block = res.scalars().first()
    if not block:
        raise HTTPException(status_code=404, detail=f"Audit block #{block_index} not found to tamper.")

    block.metadata_json = '{"tampered": true, "unauthorized_modification": "EXFILTRATION_OVERWRITTEN"}'
    await db.commit()

    return {
        "status": "TAMPER_SIMULATED",
        "tampered_block_index": block_index,
        "message": f"Block #{block_index} was deliberately corrupted. Run /api/audit/verify to observe cryptographic detection."
    }

@router.post("/repair-chain")
async def repair_chain(
    current_user: User = Depends(require_role(["auditor", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(AuditBlock).order_by(AuditBlock.block_index.asc())
    res = await db.execute(stmt)
    blocks = list(res.scalars().all())

    import hashlib
    import json
    prev = "0000000000000000000000000000000000000000000000000000000000000000"
    for b in blocks:
        b.prev_block_hash = prev
        canonical = json.dumps(json.loads(b.metadata_json), sort_keys=True)
        b.payload_sha256 = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
        b.block_hash = AuditBlock.compute_hash(
            b.block_index,
            b.timestamp_str,
            b.event_id,
            b.action_type,
            b.payload_sha256,
            b.prev_block_hash
        )
        prev = b.block_hash
    await db.commit()
    return {"status": "CHAIN_REPAIRED", "total_blocks_restored": len(blocks)}

@router.get("/export")
async def export_audit_evidence(
    current_user: User = Depends(require_role(["auditor", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    verification = await audit_chain_service.verify_integrity(db)
    stmt = select(AuditBlock).order_by(AuditBlock.block_index.asc())
    res = await db.execute(stmt)
    blocks = res.scalars().all()

    evidence_package = {
        "platform": "Bayora AI Security Laboratory",
        "standard": "SHA-256 Immutable Audit Ledger Specification v1.0",
        "verification_result": verification,
        "exported_by": {
            "username": current_user.username,
            "role": current_user.role,
            "zone": current_user.zone
        },
        "blocks": [
            {
                "index": b.block_index,
                "timestamp": b.timestamp_str,
                "event_id": b.event_id,
                "action": b.action_type,
                "actor_role": b.actor_role,
                "actor_hash": b.actor_id_hash,
                "payload_sha256": b.payload_sha256,
                "prev_hash": b.prev_block_hash,
                "block_hash": b.block_hash,
                "raw_metadata": b.metadata_json
            }
            for b in blocks
        ]
    }
    return evidence_package
