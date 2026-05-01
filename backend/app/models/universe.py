from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class Universe(Base):
    __tablename__ = "universe"

    universe_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    universe_name = Column(String, nullable=False)
    universe_description = Column(String)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    user = relationship("User")
    worlds = relationship("World", back_populates="universe", cascade="all, delete-orphan")
