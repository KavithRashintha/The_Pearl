from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional


class TouristBase(BaseModel):
    passportNumber: str
    country: str
    address: str
    birthDay: str


class TouristCreate(TouristBase):
    pass


class Tourist(TouristBase):
    id: int
    userId: int
    model_config = ConfigDict(from_attributes=True)


class TouristRegistration(BaseModel):
    name: str
    email: EmailStr
    role: str = "tourist"
    password: str
    passportNumber: str
    country: str
    address: str
    birthDay: str
    profilePicture: str


class TouristProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    passportNumber: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None
    birthDay: Optional[str] = None
    profilePicture: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
