from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.models.sandbox import Sandbox
from app.security import require_role, get_password_hash

router = APIRouter(prefix="/control", tags=["Control Plane Zone"])

class SandboxCreate(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    target_model: str = "Client-Finance-GPT-4"
    system_prompt: Optional[str] = None
    canary_token: str = "BAYORA-SEC-CANARY-9901"
    quota_rpm: int = 60
    quota_tokens_daily: int = 50000
    isolation_level: str = "STRICT_AIRGAP"

class SandboxUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    quota_rpm: Optional[int] = None
    quota_tokens_daily: Optional[int] = None
    is_active: Optional[bool] = None
    isolation_level: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str
    zone: str

@router.get("/sandboxes")
async def list_sandboxes(
    current_user: User = Depends(require_role(["admin", "auditor"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Sandbox).order_by(Sandbox.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("/sandboxes")
async def create_sandbox(
    req: SandboxCreate,
    current_user: User = Depends(require_role(["admin"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Sandbox).where(Sandbox.id == req.id)
    res = await db.execute(stmt)
    if res.scalars().first():
        raise HTTPException(status_code=400, detail="Sandbox ID already exists")

    sbx = Sandbox(
        id=req.id,
        name=req.name,
        description=req.description,
        target_model=req.target_model,
        system_prompt=req.system_prompt,
        canary_token=req.canary_token,
        quota_rpm=req.quota_rpm,
        quota_tokens_daily=req.quota_tokens_daily,
        isolation_level=req.isolation_level
    )
    db.add(sbx)
    await db.commit()
    await db.refresh(sbx)
    return sbx

@router.put("/sandboxes/{sandbox_id}")
async def update_sandbox(
    sandbox_id: str,
    req: SandboxUpdate,
    current_user: User = Depends(require_role(["admin"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Sandbox).where(Sandbox.id == sandbox_id)
    res = await db.execute(stmt)
    sbx = res.scalars().first()
    if not sbx:
        raise HTTPException(status_code=404, detail="Sandbox not found")

    if req.name is not None:
        sbx.name = req.name
    if req.description is not None:
        sbx.description = req.description
    if req.quota_rpm is not None:
        sbx.quota_rpm = req.quota_rpm
    if req.quota_tokens_daily is not None:
        sbx.quota_tokens_daily = req.quota_tokens_daily
    if req.is_active is not None:
        sbx.is_active = req.is_active
    if req.isolation_level is not None:
        sbx.isolation_level = req.isolation_level

    await db.commit()
    await db.refresh(sbx)
    return sbx

@router.get("/users")
async def list_users(
    current_user: User = Depends(require_role(["admin"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(User).order_by(User.created_at.desc())
    res = await db.execute(stmt)
    users = res.scalars().all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "zone": u.zone,
            "is_active": u.is_active,
            "created_at": u.created_at.isoformat()
        }
        for u in users
    ]

@router.post("/users")
async def create_user(
    req: UserCreate,
    current_user: User = Depends(require_role(["admin"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(User).where(User.username == req.username)
    res = await db.execute(stmt)
    if res.scalars().first():
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = User(
        username=req.username,
        email=req.email,
        hashed_password=get_password_hash(req.password),
        role=req.role,
        zone=req.zone,
        is_active=True
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "role": new_user.role,
        "zone": new_user.zone
    }
