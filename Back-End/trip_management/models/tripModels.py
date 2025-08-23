from db import Base
from sqlalchemy import Integer, Column, String, Float
from sqlalchemy.dialects.postgresql import ARRAY


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    touristId = Column(Integer)
    touristPassportNumber = Column(String)
    touristCountry = Column(String)
    tourGuideId = Column(Integer)
    destinations = Column(ARRAY(String))
    numberOfAdults = Column(Integer)
    numberOfChildren = Column(Integer)
    startDate = Column(String)
    numberOfDays = Column(Integer)
    tripStatus = Column(String)
    tripPayment = Column(Float)
    paymentStatus = Column(String)

