from pydantic import BaseModel
from typing import List


class SelectedDestinationsBase(BaseModel):
    touristId: int
    selectedDestinations: List[int]


class SelectedDestinationsCreated(SelectedDestinationsBase):
    pass


class SelectedDestinations(SelectedDestinationsBase):
    id: int

    class config:
        from_attribute = True
