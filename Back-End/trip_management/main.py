import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from starlette.middleware.cors import CORSMiddleware
from schemas import tripSchemas
from services import tripServices
from db import get_db
from sqlalchemy.orm import Session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

@app.get("/trips/trip-by-tourist/{touristId}/completed", response_model=list[tripSchemas.Trip])
def get_completed_trips_for_tourist(touristId: int, db: Session = Depends(get_db)):
    return tripServices.get_completed_trips_by_tourist(db, touristId)

@app.get("/trips/trip-by-tourist/{touristId}/accepted", response_model=list[tripSchemas.Trip])
def get_accepted_trips_by_tourist(touristId: int, db: Session = Depends(get_db)):
    return tripServices.get_accepted_trips_by_tourist(db, touristId)

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

@app.get("/trips/trip-by-tour-guide/{tourGuideId}/pending", response_model=list[tripSchemas.Trip])
def get_pending_trips_for_tour_guide(tourGuideId: int, db: Session = Depends(get_db)):
    return tripServices.get_pending_trips_by_tour_guide(db, tourGuideId)

@app.get("/trips/trip-by-tour-guide/{tourGuideId}/accepted", response_model=list[tripSchemas.Trip])
def get_accepted_trips_for_tour_guide(tourGuideId: int, db: Session = Depends(get_db)):
    return tripServices.get_accepted_trips_by_tour_guide(db, tourGuideId)

@app.get("/trips/trip-by-tour-guide/{tourGuideId}/started", response_model=list[tripSchemas.Trip])
def get_started_trips_for_tour_guide(tourGuideId: int, db: Session = Depends(get_db)):
    return tripServices.get_started_trips_by_tour_guide(db, tourGuideId)

@app.get("/trips/trip-by-tour-guide/{tourGuideId}/completed", response_model=list[tripSchemas.Trip])
def get_completed_trips_for_tour_guide(tourGuideId: int, db: Session = Depends(get_db)):
    return tripServices.get_complated_trips_by_tour_guide(db, tourGuideId)

@app.get("/api/trips/count/completed", response_model=dict, tags=["Trips"])
def get_completed_trips_count(db: Session = Depends(get_db)):
    count = tripServices.count_completed_trips(db)
    return {"completed_trips_count": count}

@app.get("/api/trips/tourist/{tourist_id}/has-active-trip", response_model=dict, tags=["Trips"])
def check_tourist_has_active_trip(tourist_id: int, db: Session = Depends(get_db)):
    has_trip = tripServices.has_active_trip_for_tourist(db, tourist_id)
    return {"has_active_trip": has_trip}

@app.get("/api/trips/tour-guide/{tour_guide_id}/has-active-trip", response_model=dict, tags=["Trips"])
def check_tour_guide_has_active_trip(tour_guide_id: int, db: Session = Depends(get_db)):
    has_trip = tripServices.has_active_trip_for_tour_guide(db, tour_guide_id)
    return {"has_active_trip": has_trip}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
