import hashlib
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text
from app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class AuditBlock(Base):
    __tablename__ = "audit_blocks"

    block_index = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    timestamp_str = Column(String(60), nullable=False)  # Canonical ISO string for deterministic SHA-256
    event_id = Column(String(36), nullable=False, index=True)
    action_type = Column(String(50), nullable=False)
    actor_role = Column(String(30), nullable=False)
    actor_id_hash = Column(String(64), nullable=False)
    payload_sha256 = Column(String(64), nullable=False)
    prev_block_hash = Column(String(64), nullable=False)
    block_hash = Column(String(64), nullable=False, unique=True)
    metadata_json = Column(Text, nullable=False)
    verified = Column(Boolean, default=True)

    @staticmethod
    def compute_hash(block_index: int, timestamp_str: str, event_id: str, action_type: str, 
                     payload_sha256: str, prev_block_hash: str) -> str:
        canonical_str = f"{block_index}|{timestamp_str}|{event_id}|{action_type}|{payload_sha256}|{prev_block_hash}"
        return hashlib.sha256(canonical_str.encode("utf-8")).hexdigest()
