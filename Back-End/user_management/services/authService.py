from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from config import settings
from db import get_db
from models import userModels, touristModel, tourGuideModels, adminModels
from schemas import touristSchema, tourGuideSchema, adminSchema, tokenSchema
from services import userService
from utils.hash import hash_password

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def register_tourist(db: Session, tourist_reg: touristSchema.TouristRegistration):
    db_user = userService.get_user_by_email(db, email=tourist_reg.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = userModels.User(
        name=tourist_reg.name,
        email=tourist_reg.email,
        role="tourist",
        hashedPassword=hash_password(tourist_reg.password),
        profilePicture=tourist_reg.profilePicture
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_tourist = touristModel.Tourist(
        userId=new_user.id,
        passportNumber=tourist_reg.passportNumber,
        country=tourist_reg.country,
        address=tourist_reg.address,
        birthDay=tourist_reg.birthDay
    )
    db.add(new_tourist)
    db.commit()
    db.refresh(new_tourist)

    return new_user

def register_tour_guide(db: Session, tour_guide_reg: tourGuideSchema.TourGuideRegistration):
    db_user = userService.get_user_by_email(db, email=tour_guide_reg.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = userModels.User(
        name=tour_guide_reg.name,
        email=tour_guide_reg.email,
        role="tour_guide",
        hashedPassword=hash_password(tour_guide_reg.password),
        profilePicture=tour_guide_reg.profilePicture
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_guide = tourGuideModels.TourGuide(
        userId=new_user.id,
        nic=tour_guide_reg.nic,
        telephone=tour_guide_reg.telephone,
        address=tour_guide_reg.address,
        licenseNumber=tour_guide_reg.licenseNumber,
        reviewCount=tour_guide_reg.reviewCount
    )
    db.add(new_guide)
    db.commit()
    db.refresh(new_guide)

    return new_user

def register_admin(db: Session, admin_reg):
    db_user = userService.get_user_by_email(db, email=admin_reg.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = userModels.User(
        name=admin_reg.name,
        email=admin_reg.email,
        role="admin",
        hashedPassword=hash_password(admin_reg.password),
        profilePicture=admin_reg.profilePicture
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_admin = adminModels.Admin(
        userId=new_user.id
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return new_user

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = tokenSchema.TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = userService.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user