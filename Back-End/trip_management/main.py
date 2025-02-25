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
