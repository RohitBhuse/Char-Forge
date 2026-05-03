from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.models import Universe, User, World, Character
from app.schemas import Universe as UniverseSchema, UniverseCreate, ChatRequest, ChatMessage, UniverseTree
from app.core.auth import get_current_user

router = APIRouter(prefix="/universes", tags=["universes"])

@router.get("/tree", response_model=List[UniverseTree])
def get_universe_tree(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    universes = db.query(Universe).filter(Universe.user_id == current_user.user_id).all()
    
    # Populate legacy attribute_list for frontend compatibility
    for univ in universes:
        for world in univ.worlds:
            if world.attributes and "tags" in world.attributes:
                # Our new storage pattern uses a 'tags' key for the list of strings
                world.attribute_list = ",".join(world.attributes["tags"])
            elif world.attributes:
                # Fallback for other potential JSON structures
                world.attribute_list = ",".join(world.attributes.keys())
                
    return universes

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    universe_count = db.query(Universe).filter(Universe.user_id == current_user.user_id).count()
    world_count = db.query(World).filter(World.user_id == current_user.user_id).count()
    character_count = db.query(Character).filter(Character.user_id == current_user.user_id).count()
    
    return {
        "universes": universe_count,
        "worlds": world_count,
        "characters": character_count
    }

@router.post("/", response_model=UniverseSchema, status_code=status.HTTP_201_CREATED)
def create_universe(
    universe: UniverseCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_universe = Universe(
        **universe.model_dump(),
        user_id=current_user.user_id
    )
    db.add(new_universe)
    db.commit()
    db.refresh(new_universe)
    return new_universe

@router.get("/", response_model=List[UniverseSchema])
def list_universes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Universe).filter(Universe.user_id == current_user.user_id).all()

@router.post("/chat", response_model=ChatMessage)
def chat_with_weaver(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    # Simulated AI logic for universe forging
    user_messages = [m for m in request.messages if m.role == "user"]
    
    if not user_messages:
        return ChatMessage(role="assistant", content="What kind of universe you want to cook today?")
    
    latest_intent = user_messages[-1].content.lower()
    
    if any(word in latest_intent for word in ["name", "call", "title"]):
        response = "A profound title. Shall we define the core physical laws of this reality, or perhaps its primary inhabitants?"
    elif any(word in latest_intent for word in ["magic", "power", "spell"]):
        response = "Energy flows differently here. What is the source of this power, and who (if anyone) can wield it?"
    elif any(word in latest_intent for word in ["sci-fi", "space", "future", "tech"]):
        response = "The void is vast. Is this a galaxy of unified peace, or one fractured by ancient stellar conflicts?"
    elif any(word in latest_intent for word in ["dark", "horror", "grim"]):
        response = "Shadows cling to the edges of existence. What ancient fear haunts the hearts of those born here?"
    else:
        response = "The celestial loom is listening. Tell me more about the atmosphere, the people, or the destiny of this new existence."
        
    return ChatMessage(role="assistant", content=response)

@router.delete("/{universe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_universe(
    universe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_universe = db.query(Universe).filter(
        Universe.universe_id == universe_id,
        Universe.user_id == current_user.user_id
    ).first()
    
    if not db_universe:
        raise HTTPException(status_code=404, detail="Universe not found")
    
    db.delete(db_universe)
    db.commit()
    return None
