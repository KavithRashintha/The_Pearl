from sqlalchemy.orm import Session
from models import userModels


def get_user_by_email(db: Session, email: str):
    return db.query(userModels.User).filter(userModels.User.email == email).first()


def get_user(db: Session, user_id: int):
    return db.query(userModels.User).filter(userModels.User.id == user_id).first()
