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
    universe_id = Column(Integer, ForeignKey("universe.universe_id", ondelete="CASCADE"), nullable=False)
    character_name = Column(String, nullable=False)
    core_description = Column(String)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User")
    universe = relationship("Universe")
    variants = relationship("CharacterVariant", back_populates="character", cascade="all, delete-orphan")

class CharacterVariant(Base):
    __tablename__ = "character_variant"

    variant_id = Column(Integer, primary_key=True, index=True)
    character_id = Column(Integer, ForeignKey("character.character_id", ondelete="CASCADE"), nullable=False)
    world_id = Column(Integer, ForeignKey("world.world_id", ondelete="CASCADE"), nullable=False)
    variant_name = Column(String, nullable=False)
    attributes = Column(JSONB, default={})
    status = Column(Enum(CharacterStatus, name="character_status"), default=CharacterStatus.New, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    character = relationship("Character", back_populates="variants")
    world = relationship("World")
    
    # Relationships where this variant is the source
    relationships_from = relationship(
        "CharacterRelationship",
        foreign_keys="CharacterRelationship.from_variant_id",
        back_populates="from_variant",
        cascade="all, delete-orphan"
    )
    # Relationships where this variant is the target
    relationships_to = relationship(
        "CharacterRelationship",
        foreign_keys="CharacterRelationship.to_variant_id",
        back_populates="to_variant",
        cascade="all, delete-orphan"
    )

class CharacterRelationship(Base):
    __tablename__ = "character_relationship"

    relationship_id = Column(Integer, primary_key=True, index=True)
    from_variant_id = Column(Integer, ForeignKey("character_variant.variant_id", ondelete="CASCADE"), nullable=False)
    to_variant_id = Column(Integer, ForeignKey("character_variant.variant_id", ondelete="CASCADE"), nullable=False)
    relationship_type = Column(String, nullable=False)
    metadata_ = Column("metadata", JSONB, default={}) # 'metadata' is reserved in SQLAlchemy, using metadata_
    created_at = Column(DateTime, default=func.now(), nullable=False)

    from_variant = relationship("CharacterVariant", foreign_keys=[from_variant_id], back_populates="relationships_from")
    to_variant = relationship("CharacterVariant", foreign_keys=[to_variant_id], back_populates="relationships_to")
