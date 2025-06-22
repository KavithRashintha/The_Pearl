from db import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    role = Column(String)  # 'tourist', 'admin', 'tour_guide'
    hashed_password = Column(String)

    tourist = relationship("Tourist", back_populates="user", uselist=False, cascade="all, delete-orphan")
    tour_guide = relationship("TourGuide", back_populates="user", uselist=False, cascade="all, delete-orphan")
