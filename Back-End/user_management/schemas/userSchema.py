from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class UserDetails(User):
    tourist: Optional['Tourist'] = None
    tour_guide: Optional['TourGuide'] = None
    model_config = ConfigDict(from_attributes=True)

# At the bottom of the file, after all classes are defined
try:
    from .touristSchema import Tourist
    from .tourGuideSchema import TourGuide
    UserDetails.model_rebuild()
except ImportError:
    pass