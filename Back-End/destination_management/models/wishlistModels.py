from db import Base
from sqlalchemy import Integer, Column, String
from sqlalchemy.dialects.postgresql import ARRAY


class WishList(Base):
    __tablename__ = "wishlist"

    id = Column(Integer, primary_key=True, index=True)
    touristId = Column(Integer)
    destinations = Column(ARRAY(String))
