import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean
from app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "control_users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False)  # red_operator, blue_operator, admin, auditor
    zone = Column(String(30), nullable=False)  # red_zone, blue_zone, control_plane, audit_zone
    is_active = Column(Boolean, default=True)
    api_key = Column(String(64), unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
