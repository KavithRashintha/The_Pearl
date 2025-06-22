from db import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


class TourGuide(Base):
    __tablename__ = "tour_guides"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"), unique=True)
    nic = Column(String, unique=True)
    telephone = Column(String)
    address = Column(String)
    licenseNumber = Column(String)
    reviewCount = Column(Integer)

    user = relationship("User", back_populates="tour_guide")
