from db import Base
from sqlalchemy import Integer, Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY


class Destinations(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    details = Column(String)
    type = Column(String)
    activities = Column(ARRAY(String))
    province = Column(String)
    district = Column(String)
    climate = Column(String)
