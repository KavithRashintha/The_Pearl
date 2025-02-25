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
