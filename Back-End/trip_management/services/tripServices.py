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


def get_trip_by_tour_guide_id(db: Session, tour_guide_id: int):
    return db.query(Trip).filter(Trip.tourGuideId == tour_guide_id).all()


def update_trip_status(db: Session, tripId: int, status_update: tripSchemas.TripStatusUpdate):
    trip = db.query(Trip).filter(Trip.id == tripId).first()

    if trip:
        trip.tripStatus = status_update.tripStatus
        db.commit()
        db.refresh(trip)
        return trip
    return None


def update_trip_payment_status(db: Session, tripId: int, payment_update: tripSchemas.TripPaymentStatusUpdate):
    trip = db.query(Trip).filter(Trip.id == tripId).first()

    if trip:
        trip.paymentStatus = payment_update.paymentStatus
        db.commit()
        db.refresh(trip)
        return trip
    return None

def get_completed_trips_by_tourist(db: Session, tourist_id: int):
    return db.query(Trip).filter(
        Trip.touristId == tourist_id,
        Trip.tripStatus == "completed"
    ).all()
