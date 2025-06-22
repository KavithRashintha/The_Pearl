from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from config import settings
from db import get_db
from models import userModels, touristModel, tourGuideModels
from schemas import touristSchema, tourGuideSchema, tokenSchema
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
        user_id=new_user.id,
        passport_number=tourist_reg.passport_number,
        country=tourist_reg.country
    )
    db.add(new_tourist)
    db.commit()
    db.refresh(new_tourist)

    return new_user

# You can create a similar register_tour_guide function here

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