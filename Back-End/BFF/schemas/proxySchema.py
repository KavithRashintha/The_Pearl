from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional

class TripBase(BaseModel):
    touristId: int
    touristPassportNumber: str
    touristCountry: str
    tourGuideId: int
    destinations: List[str]
    numberOfAdults: int
    numberOfChildren: int
    startDate: str
    numberOfDays: int
    tripStatus: str
    tripPayment: float
    paymentStatus: str

class TripCreated(TripBase):
    pass

class Trip(TripBase):
    id: int
    class Config:
        from_attributes = True

class TripWithTouristInfo(Trip):
    touristName: str

class TripStatusUpdate(BaseModel):
    tripStatus: str

class TripPaymentStatusUpdate(BaseModel):
    paymentStatus: str

class DestinationBase(BaseModel):
    name: str
    details: List[str]
    type: str
    activities: List[str]
    province: str
    district: str
    climate: str
    image: str

class DestinationCreated(DestinationBase):
    pass

class Destination(DestinationBase):
    id: int
    class Config:
        from_attributes = True

class WishListBase(BaseModel):
    touristId: int
    destinations: List[int]

class WishListCreated(WishListBase):
    pass

class WishList(WishListBase):
    id: int
    class Config:
        from_attributes = True

class SelectedDestinationsBase(BaseModel):
    touristId: int
    selectedDestinations: List[int]

class SelectedDestinationsCreated(SelectedDestinationsBase):
    pass

class SelectedDestinations(SelectedDestinationsBase):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TouristRegistration(BaseModel):
    name: str
    email: EmailStr
    role: str = "tourist"
    password: str
    passportNumber: str
    country: str
    address: str
    birthDay: str

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

class AdminRegistration(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "admin"

class TouristProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    passportNumber: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None
    birthDay: Optional[str] = None
    profilePicture: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class TourGuide(BaseModel):
    id: int
    userId: int
    nic: str
    telephone: str
    address: str
    licenseNumber: str
    reviewCount: int
    name: str
    email: Optional[EmailStr] = None
    profilePicture: Optional[str] = None

class TourGuideProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None
    address: Optional[str] = None
    nic: Optional[str] = None
    licenseNumber: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class UserDetails(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    profilePicture: Optional[str] = None
    tourist: Optional[dict] = None
    tour_guide: Optional[dict] = None
    admin: Optional[dict] = None
    model_config = ConfigDict(from_attributes=True)