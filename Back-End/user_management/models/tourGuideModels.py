from db import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


class TourGuide(Base):
    __tablename__ = "tour_guides"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    nic = Column(String, unique=True, nullable=False)
    telephone = Column(String, nullable=False)

    user = relationship("User", back_populates="tour_guide")
