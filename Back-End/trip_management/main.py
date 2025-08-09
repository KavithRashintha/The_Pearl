import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from schemas import tripSchemas
from services import tripServices
from db import get_db
from sqlalchemy.orm import Session
from typing import List

app = FastAPI()


@app.post("/trips/add", response_model=tripSchemas.Trip)
def create_trip(trip: tripSchemas.TripCreated, db: Session = Depends(get_db)):
    return tripServices.create_trip(db, trip)


@app.get("/trips/", response_model=list[tripSchemas.Trip])
def get_all_trips(db: Session = Depends(get_db)):
    return tripServices.get_all_trip(db)


@app.get("/trips/trip-by-tourist/{touristId}", response_model=list[tripSchemas.Trip])
def get_trip_by_tourist_id(touristId: int, db: Session = Depends(get_db)):
    return tripServices.get_trip_by_tourist_id(db, touristId)


@app.get("/trips/trip-by-tour-guide/{tourGuideId}", response_model=list[tripSchemas.Trip])
def get_trip_by_tour_guide_id(tourGuideId: int, db: Session = Depends(get_db)):
    return tripServices.get_trip_by_tour_guide_id(db, tourGuideId)


@app.patch('/trips/{tripId}/update-trip-status', response_model=tripSchemas.Trip)
def update_trip_status(tripId: int, status_update: tripSchemas.TripStatusUpdate, db: Session = Depends(get_db)):
    updated_trip_status = tripServices.update_trip_status(db, tripId, status_update)
    if not updated_trip_status:
        raise HTTPException(status_code=404, detail="Trip not found")
    return updated_trip_status


@app.patch('/trips/{tripId}/update-payment-status', response_model=tripSchemas.Trip)
def update_trip_payment_status(tripId: int, payment_update: tripSchemas.TripPaymentStatusUpdate,
                               db: Session = Depends(get_db)):
    updated_payment_status = tripServices.update_trip_payment_status(db, tripId, payment_update)
    if not updated_payment_status:
        raise HTTPException(status_code=404, detail="Trip not found")
    return updated_payment_status
