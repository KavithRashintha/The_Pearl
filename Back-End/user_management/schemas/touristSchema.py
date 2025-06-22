from pydantic import BaseModel, ConfigDict
from typing import Optional

class TouristBase(BaseModel):
    passport_number: str
    country: str

class TouristCreate(TouristBase):
    pass

class Tourist(TouristBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)

class TouristRegistration(BaseModel):
    name: str
    email: str
    role: str = "tourist"
    password: str
    passport_number: str
    country: str