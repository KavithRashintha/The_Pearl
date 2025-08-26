from sqlalchemy.orm import Session
from models import userModels
from schemas import touristSchema

def get_tourist_profile(db: Session, user_id: int):
    return db.query(userModels.User).filter(userModels.User.id == user_id).first()

def update_tourist_profile(db: Session, user_id: int, update_data: touristSchema.TouristProfileUpdate):
    db_user = get_tourist_profile(db, user_id)
    if not db_user or not db_user.tourist:
        return None

    update_dict = update_data.model_dump(exclude_unset=True)

    for key, value in update_dict.items():
        if hasattr(db_user, key):
            setattr(db_user, key, value)
        elif hasattr(db_user.tourist, key):
            setattr(db_user.tourist, key, value)

    db.commit()
    db.refresh(db_user)

    return db_user