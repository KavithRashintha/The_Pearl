from pydantic import BaseModel
from typing import List


class WishListBase(BaseModel):
    touristId: int
    destinations: List[str]


class WishListCreated(WishListBase):
    pass


class WishList(WishListBase):
    id: int

    class config:
        from_attribute = True
