from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Event(Base):
    __tablename__ = "event"

    event_id = Column(Integer, primary_key=True, index=True)
    world_id = Column(Integer, ForeignKey("world.world_id", ondelete="CASCADE"), nullable=False)
    event_name = Column(String, nullable=False)
    event_description = Column(String)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    world = relationship("World")
    character_events = relationship("CharacterEvent", back_populates="event", cascade="all, delete-orphan")

class CharacterEvent(Base):
    __tablename__ = "character_event"

    id = Column(Integer, primary_key=True, index=True)
    variant_id = Column(Integer, ForeignKey("character_variant.variant_id", ondelete="CASCADE"), nullable=False)
    event_id = Column(Integer, ForeignKey("event.event_id", ondelete="CASCADE"), nullable=False)
    role = Column(String)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    variant = relationship("CharacterVariant")
    event = relationship("Event", back_populates="character_events")
