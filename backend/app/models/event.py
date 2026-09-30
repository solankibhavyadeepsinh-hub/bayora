import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, Float
from app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(DateTime(timezone=True), default=utc_now, index=True)
    sandbox_id = Column(String(50), nullable=False)
    actor_id = Column(String(36), nullable=False)
    actor_role = Column(String(30), nullable=False)
    stage = Column(String(30), nullable=False)
    decision = Column(String(20), nullable=False)
    triggered_rule_id = Column(String(50), nullable=True)
    owasp_category = Column(String(50), nullable=True)
    severity = Column(String(20), default="INFO")
    raw_payload = Column(Text, nullable=True)
    sanitized_snippet = Column(Text, nullable=True)
    response_preview = Column(Text, nullable=True)
    latency_ms = Column(Float, default=0.0)
    tokens_consumed = Column(Integer, default=0)
