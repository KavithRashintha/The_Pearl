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
