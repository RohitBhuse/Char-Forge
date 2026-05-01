from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.core.database import Base

class World(Base):
    __tablename__ = "world"

    world_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    universe_id = Column(ForeignKey("universe.universe_id", ondelete="CASCADE"), nullable=False)
    world_name = Column(String, nullable=False)
    world_description = Column(String)
    world_timeline = Column(Date)
    attribute_list = Column(String) # Comma-separated list of attributes
    created_at = Column(DateTime, default=func.now(), nullable=False)

    user = relationship("User")
    universe = relationship("Universe", back_populates="worlds")
