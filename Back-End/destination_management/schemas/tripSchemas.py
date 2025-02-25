from pydantic import BaseModel
from typing import List


class TripBase(BaseModel):
    touristId: int
    tourGuideId: int
    destinations: List[str]
    numberOfAdults: int
    numberOfChildren: int
    numberOfDays: int
    tripStatus: str
    tripPayment: float
    paymentStatus: str


class TripCreated(TripBase):
    pass


class TripStatusUpdate(BaseModel):
    tripStatus: str


class Trip(TripBase):
    id: int

    class config:
        from_attribute = True
