from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    profilePicture: Optional[str] = None

class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class UserDetails(User):
    tourist: Optional['Tourist'] = None
    tour_guide: Optional['TourGuide'] = None
    admin: Optional['Admin'] = None
    profilePicture: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


try:
    from .touristSchema import Tourist
    from .tourGuideSchema import TourGuide
    from .adminSchema import Admin

    UserDetails.model_rebuild()
except ImportError:
    pass
