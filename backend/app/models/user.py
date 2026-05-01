import uuid
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_name = Column(String, nullable=False)
    user_email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    genres = Column(String, nullable=True)            # comma-separated list
    architectural_style = Column(String, nullable=True) # comma-separated list
    onboarding_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
