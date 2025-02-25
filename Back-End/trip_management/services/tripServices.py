from sqlalchemy.orm import Session
from schemas import tripSchemas
from models.tripModels import Trip
from typing import List


def create_trip(db: Session, data: tripSchemas.TripCreated):
    new_trip = Trip(**data.model_dump())
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip


def get_all_trip(db: Session):
    return db.query(Trip).all()


def get_trip_by_tourist_id(db: Session, tourist_id: int):
    return db.query(Trip).filter(Trip.touristId == tourist_id).all()
