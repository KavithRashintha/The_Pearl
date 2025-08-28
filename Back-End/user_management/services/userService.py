from sqlalchemy.orm import Session
from models import userModels


def get_user_by_email(db: Session, email: str):
    return db.query(userModels.User).filter(userModels.User.email == email).first()


def get_user(db: Session, user_id: int):
    return db.query(userModels.User).filter(userModels.User.id == user_id).first()

def count_users_by_role(db: Session):
    tourists_count = db.query(userModels.User).filter(userModels.User.role == "tourist").count()
    tour_guides_count = db.query(userModels.User).filter(userModels.User.role == "tour_guide").count()

    return {"tourists_count": tourists_count, "tour_guides_count": tour_guides_count}
