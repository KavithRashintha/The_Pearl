from pydantic import BaseModel, ConfigDict


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
    email: str
    role: str = "tour_guide"
    password: str
    nic: str
    telephone: str
    address: str
    licenseNumber: str
    reviewCount: int
