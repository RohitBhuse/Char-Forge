from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import User
from app.models.world import World
from app.models.universe import Universe
from app.schemas.world import World as WorldSchema, WorldCreate, WorldUpdate, WorldAttributeUpdate
from app.schemas.universe import ChatMessage, ChatRequest
from app.core.auth import get_current_user

router = APIRouter(prefix="/universes/{universe_id}/worlds", tags=["worlds"])


def _get_universe_or_404(universe_id: int, user_id, db: Session) -> Universe:
    universe = db.query(Universe).filter(
        Universe.universe_id == universe_id,
        Universe.user_id == user_id
    ).first()
    if not universe:
        raise HTTPException(status_code=404, detail="Universe not found")
    return universe


@router.post("/", response_model=WorldSchema, status_code=status.HTTP_201_CREATED)
def create_world(
    universe_id: int,
    world: WorldCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    _get_universe_or_404(universe_id, current_user.user_id, db)

    timeline_date = None
    if world.world_timeline:
        try:
            year = int(world.world_timeline.strip())
            timeline_date = date(year, 1, 1)
        except (ValueError, TypeError):
            timeline_date = None

    new_world = World(
        world_name=world.world_name,
        world_description=world.world_description,
        world_timeline=timeline_date,
        attributes=world.attributes or {},
        universe_id=universe_id,
        user_id=current_user.user_id,
    )
    try:
        db.add(new_world)
        db.commit()
        db.refresh(new_world)
        # Ensure attribute_list is empty string for new worlds
        new_world.attribute_list = ""
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create world: {str(e)}")
    return new_world


@router.get("/{world_id}/attributes", response_model=WorldAttributeUpdate)
def get_world_attributes(
    universe_id: int,
    world_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_world = db.query(World).filter(
        World.world_id == world_id,
        World.universe_id == universe_id,
        World.user_id == current_user.user_id
    ).first()

    if not db_world:
        raise HTTPException(status_code=404, detail="World not found")

    attributes = db_world.attributes or {}
    # Legacy support: if frontend expects attribute_list as string
    attr_list_str = ",".join(attributes.get("tags", [])) if isinstance(attributes.get("tags"), list) else ""
    return WorldAttributeUpdate(attributes=attributes, attribute_list=attr_list_str)


@router.get("/{world_id}/add_attribute_list", response_model=WorldAttributeUpdate)
def get_world_attributes_legacy(
    universe_id: int,
    world_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_world_attributes(universe_id, world_id, db, current_user)


@router.post("/{world_id}/attributes", response_model=WorldSchema)
def update_world_attributes(
    universe_id: int,
    world_id: int,
    attribute_update: WorldAttributeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_world = db.query(World).filter(
        World.world_id == world_id,
        World.universe_id == universe_id,
        World.user_id == current_user.user_id
    ).first()

    if not db_world:
        raise HTTPException(status_code=404, detail="World not found")

    try:
        if attribute_update.attributes is not None:
            db_world.attributes = attribute_update.attributes
        elif attribute_update.attribute_list is not None:
            # Convert legacy string list to new JSON format
            tags = [t.strip() for t in attribute_update.attribute_list.split(",") if t.strip()]
            db_world.attributes = {"tags": tags}
            
        db.add(db_world)
        db.commit()
        db.refresh(db_world)
        # Populate for response
        if db_world.attributes and "tags" in db_world.attributes:
            db_world.attribute_list = ",".join(db_world.attributes["tags"])
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update attributes: {str(e)}")
    return db_world


@router.post("/{world_id}/add_attribute_list", response_model=WorldSchema)
def update_world_attributes_legacy(
    universe_id: int,
    world_id: int,
    attribute_update: WorldAttributeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_world_attributes(universe_id, world_id, attribute_update, db, current_user)


@router.get("/", response_model=List[WorldSchema])
def list_worlds(
    universe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    _get_universe_or_404(universe_id, current_user.user_id, db)
    worlds = db.query(World).filter(
        World.universe_id == universe_id,
        World.user_id == current_user.user_id
    ).order_by(World.created_at.asc()).all()

    # Populate attribute_list for legacy frontend support
    for w in worlds:
        if w.attributes and "tags" in w.attributes:
            w.attribute_list = ",".join(w.attributes["tags"])
        elif w.attributes:
             # If attributes exists but not 'tags', just indicate it's initialized
             w.attribute_list = "initialized"
        else:
            w.attribute_list = ""
            
    return worlds


@router.delete("/{world_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_world(
    universe_id: int,
    world_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    world = db.query(World).filter(
        World.world_id == world_id,
        World.universe_id == universe_id,
        World.user_id == current_user.user_id
    ).first()
    if not world:
        raise HTTPException(status_code=404, detail="World not found")
    try:
        db.delete(world)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete world: {str(e)}")
    return None


@router.post("/chat", response_model=ChatMessage)
def chat_with_world_weaver(
    universe_id: int,
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    user_messages = [m for m in request.messages if m.role == "user"]

    if not user_messages:
        return ChatMessage(role="assistant", content="What world shall we forge within this universe?")

    latest = user_messages[-1].content.lower()

    if any(w in latest for w in ["name", "call", "title"]):
        response = "A fine name for this realm. What era does it inhabit — ancient, modern, or beyond time itself?"
    elif any(w in latest for w in ["timeline", "era", "age", "time", "history"]):
        response = "Time is the skeleton of every world. Shall this world's history be linear, cyclical, or fractured across realities?"
    elif any(w in latest for w in ["people", "race", "species", "inhabitant"]):
        response = "Every world needs souls. Describe the dominant beings — their culture, conflicts, and beliefs."
    elif any(w in latest for w in ["magic", "tech", "power", "rule"]):
        response = "The laws that govern a world define its soul. Is this a world of rigid science, wild magic, or something yet unnamed?"
    else:
        response = "The Weaver listens. Tell me about the landscapes, the rulers, or the great conflicts that define this world."

    return ChatMessage(role="assistant", content=response)