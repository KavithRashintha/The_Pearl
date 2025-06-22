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
    # Check if user with that email already exists
    db_user = userService.get_user_by_email(db, email=tourist_reg.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create User
    new_user = userModels.User(
        name=tourist_reg.name,
        email=tourist_reg.email,
        role="tourist",
        hashed_password=hash_password(tourist_reg.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create Tourist profile linked to the user
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
    """Register a new tour guide with their profile"""
    # Check if user exists
    db_user = userService.get_user_by_email(db, email=tour_guide_reg.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create User
    new_user = userModels.User(
        name=tour_guide_reg.name,
        email=tour_guide_reg.email,
        role="tour_guide",  # Force role here
        hashed_password=hash_password(tour_guide_reg.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create Tour Guide profile
    new_guide = tourGuideModels.TourGuide(
        user_id=new_user.id,
        nic=tour_guide_reg.nic,
        telephone=tour_guide_reg.telephone
    )
    db.add(new_guide)
    db.commit()
    db.refresh(new_guide)

    return new_user

def register_admin(db: Session, admin_reg):
    """Register a new admin with their profile"""
    # Check if user exists
    db_user = userService.get_user_by_email(db, email=admin_reg.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create User
    new_user = userModels.User(
        name=admin_reg.name,
        email=admin_reg.email,
        role="admin",  # Force role here
        hashed_password=hash_password(admin_reg.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create Admin profile
    new_admin = adminModels.Admin(
        user_id=new_user.id
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