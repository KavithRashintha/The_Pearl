from sqlalchemy.orm import Session
from schemas import wishlistSchemas
from models.wishlistModels import WishList
from typing import List


def create_wishlist(db: Session, data: wishlistSchemas.WishListCreated):
    new_wishlist = WishList(**data.model_dump())
    db.add(new_wishlist)
    db.commit()
    db.refresh(new_wishlist)
    return new_wishlist


def get_wishlist(db: Session, tourist_id: int):
    return db.query(WishList).filter(WishList.touristId == tourist_id).first()


def update_wishlist(db: Session, wishlist_id: int, new_destinations: List[str]):
    wishlist = db.query(WishList).filter(WishList.id == wishlist_id).first()

    if wishlist:
        wishlist.destinations = new_destinations
        db.commit()
        db.refresh()
