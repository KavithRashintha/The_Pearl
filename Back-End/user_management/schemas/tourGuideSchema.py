from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional

class TourGuideBase(BaseModel):
    nic: str
    telephone: str
    address: str
    licenseNumber: str
    reviewCount: int


class TourGuideCreate(TourGuideBase):
    pass


class TourGuide(TourGuideBase):
    id: int
    userId: int
    model_config = ConfigDict(from_attributes=True)


class TourGuideRegistration(BaseModel):
    name: str
    email: EmailStr
    role: str = "tour_guide"
    password: str
    nic: str
    telephone: str
    address: str
    licenseNumber: str
    reviewCount: int

class TourGuideProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None
    address: Optional[str] = None
    nic: Optional[str] = None
    licenseNumber: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
