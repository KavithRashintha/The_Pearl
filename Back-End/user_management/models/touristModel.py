from db import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


class Tourist(Base):
    __tablename__ = "tourists"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"), unique=True)
    passportNumber = Column(String)
    country = Column(String)
    address = Column(String)
    birthDay = Column(String)

    user = relationship("User", back_populates="tourist")
