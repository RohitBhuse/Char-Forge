import enum
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.core.database import Base

class CharacterStatus(str, enum.Enum):
    New = "New"
    Updated = "Updated"
    Copied = "Copied"

class Character(Base):
    __tablename__ = "character"

    character_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    universe_id = Column(ForeignKey("universe.universe_id", ondelete="CASCADE"), nullable=False)
    world_id = Column(ForeignKey("world.world_id", ondelete="CASCADE"), nullable=False)
    character_name = Column(String, nullable=False)
    character_attribute = Column(JSONB, nullable=True)
    status = Column(Enum(CharacterStatus, name="character_status"), default=CharacterStatus.New, nullable=False)
    tags = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User")
    universe = relationship("Universe")
    world = relationship("World")
