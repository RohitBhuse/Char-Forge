from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID

class UserCreate(BaseModel):
    user_name: str
    user_email: EmailStr
    password: str

class UserOnboarding(BaseModel):
    genres: List[str]
    architectural_style: List[str]

class UserResponse(BaseModel):
    user_id: UUID
    user_name: str
    user_email: EmailStr
    genres: Optional[str] = None
    architectural_style: Optional[str] = None
    onboarding_completed: bool

    class Config:
        from_attributes = True
