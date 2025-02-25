from pydantic import BaseModel
from typing import List


class DestinationBase(BaseModel):
    name: str
    details: str
    type: str
    activities: List[str]
    province: str
    district: str
    climate: str


class DestinationCreated(DestinationBase):
    pass


class Destination(DestinationBase):
    id: int

    class config:
        from_attribute = True


