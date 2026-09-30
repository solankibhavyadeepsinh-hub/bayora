import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text
from app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Sandbox(Base):
    __tablename__ = "control_sandboxes"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    target_model = Column(String(50), default="Client-Finance-GPT-4")
    system_prompt = Column(Text, nullable=True)
    canary_token = Column(String(100), default="BAYORA-SEC-CANARY-4091")
    quota_rpm = Column(Integer, default=60)
    quota_tokens_daily = Column(Integer, default=100000)
    current_tokens_used = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    isolation_level = Column(String(20), default="STRICT_AIRGAP")
    created_at = Column(DateTime(timezone=True), default=utc_now)
