import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text
from app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class AttackRecord(Base):
    __tablename__ = "red_attack_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    campaign_id = Column(String(50), nullable=True)
    operator_id = Column(String(36), nullable=False)
    target_sandbox_id = Column(String(50), nullable=False)
    prompt_payload = Column(Text, nullable=False)
    attack_category = Column(String(50), default="Direct Prompt Injection")
    status = Column(String(20), nullable=False)
    model_response = Column(Text, nullable=False)
    latency_ms = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utc_now)

class AttackCampaign(Base):
    __tablename__ = "red_attack_campaigns"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    target_sandbox_id = Column(String(50), nullable=False)
    operator_id = Column(String(36), nullable=False)
    status = Column(String(20), default="IDLE")
    total_attacks = Column(Integer, default=0)
    successful_attacks = Column(Integer, default=0)
    blocked_attacks = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utc_now)
