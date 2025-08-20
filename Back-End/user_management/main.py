import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from db import engine, Base, get_db
from models import userModels
from schemas import tokenSchema, touristSchema, userSchema, adminSchema, tourGuideSchema
from services import authService, userService, tourGuideService
from utils.hash import verify_password
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def read_root():
    """A simple welcome message for the API root."""
    return {"message": "Welcome to the User Management Service! 👤"}

@app.post("/auth/register/tourist", status_code=status.HTTP_201_CREATED, tags=["Authentication"])
def register_new_tourist(
        tourist_reg_data: touristSchema.TouristRegistration,
        db: Session = Depends(get_db)
):
    db_user = authService.register_tourist(db, tourist_reg=tourist_reg_data)
    return {"message": f"Tourist '{db_user.name}' created successfully."}

@app.post("/auth/register/tourist", status_code=status.HTTP_201_CREATED, tags=["Authentication"])
def register_new_tourist(
        tourist_reg_data: touristSchema.TouristRegistration,
        db: Session = Depends(get_db)
):
    db_user = authService.register_tourist(db, tourist_reg=tourist_reg_data)
    return {"message": f"Tourist '{db_user.name}' created successfully."}

# Tour Guide Endpoints
@app.post("/auth/register/guide", status_code=status.HTTP_201_CREATED, tags=["Authentication"])
def register_new_guide(
        guide_reg_data: tourGuideSchema.TourGuideRegistration,
        db: Session = Depends(get_db)
):
    db_user = authService.register_tour_guide(db, tour_guide_reg=guide_reg_data)
    return {"message": f"Tour Guide '{db_user.name}' created successfully."}

@app.post("/auth/register/admin", status_code=status.HTTP_201_CREATED, tags=["Authentication"])
def register_new_admin(
        admin_reg_data: adminSchema.AdminRegistration,
        db: Session = Depends(get_db)
):
    db_user = authService.register_admin(db, admin_reg=admin_reg_data)
    return {"message": f"Admin '{db_user.name}' created successfully."}


@app.post("/auth/token", response_model=tokenSchema.Token, tags=["Authentication"])
def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    user = userService.get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = authService.create_access_token(
        data={"sub": user.email, "role": user.role}
    )

    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=userSchema.UserDetails, tags=["Users"])
def read_current_user_profile(
        current_user: userModels.User = Depends(authService.get_current_user)
):
    return current_user

@app.get("/users/tour-guides", response_model=list[tourGuideSchema.TourGuide], tags=["Users"])
def read_tour_guides(db: Session = Depends(get_db)):
    return tourGuideService.get_all_tour_guides(db)




