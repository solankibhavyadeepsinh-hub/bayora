import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text
from app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class DefenseRule(Base):
    __tablename__ = "blue_defense_rules"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    stage = Column(String(20), nullable=False)  # "INPUT_FILTER" or "OUTPUT_FILTER"
    rule_type = Column(String(30), nullable=False)  # "REGEX", "KEYWORD", "CANARY_GUARD", "ENTROPY"
    pattern = Column(Text, nullable=False)
    action = Column(String(20), default="BLOCK")  # "BLOCK", "SANITIZE", "ALERT"
    severity = Column(String(20), default="HIGH")  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    owasp_category = Column(String(50), default="LLM01: Prompt Injection")
    is_active = Column(Boolean, default=True)
    trigger_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
