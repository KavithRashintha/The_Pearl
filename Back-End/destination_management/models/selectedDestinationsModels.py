from db import Base
from sqlalchemy import Integer, Column
from sqlalchemy.dialects.postgresql import ARRAY


class SelectedDestinations(Base):
    __tablename__ = "selected_destinations"

    id = Column(Integer, primary_key=True, index=True)
    touristId = Column(Integer)
    selectedDestinations = Column(ARRAY(Integer))
