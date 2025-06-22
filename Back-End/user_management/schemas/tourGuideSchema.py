from pydantic import BaseModel, ConfigDict
from typing import Optional

class TourGuideBase(BaseModel):
    nic: str
    telephone: str

class TourGuideCreate(TourGuideBase):
    pass

class TourGuide(TourGuideBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)

class TourGuideRegistration(BaseModel):
    name: str
    email: str
    role: str = "tour_guide"
    password: str
    nic: str
    telephone: str