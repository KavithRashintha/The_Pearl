from pydantic import BaseModel, ConfigDict, EmailStr


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
