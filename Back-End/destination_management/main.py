from fastapi import FastAPI, Depends, HTTPException
from schemas import destinationSchemas, wishlistSchemas, selectedDestinationsSchemas, tripSchemas
from services import destinationServices, wishlistServices, selectedDestinationsServices, tripServices
from db import get_db
from sqlalchemy.orm import Session
from typing import List

app = FastAPI()


@app.post("/destinations/add", response_model=destinationSchemas.Destination)
def add_destination(destination: destinationSchemas.DestinationCreated, db: Session = Depends(get_db)):
    return destinationServices.create_destination(db, destination)


@app.get("/destinations/", response_model=list[destinationSchemas.Destination])
def get_all_destinations(db: Session = Depends(get_db)):
    return destinationServices.get_all_destinations(db)


@app.get("/destinations/destination/{id}", response_model=destinationSchemas.Destination)
def get_destination_by_id(id: int, db: Session = Depends(get_db)):
    destination = destinationServices.get_destination(db, id);
    if destination:
        return destination
    raise HTTPException(status_code=404, detail="Invalid Destination ID")


@app.put("/destinations/update_destination/{id}", response_model=destinationSchemas.Destination)
def update_destination(destination: destinationSchemas.DestinationCreated, id: int, db: Session = Depends(get_db)):
    db_update = destinationServices.update_destination(db, destination, id)
    if db_update is None:
        raise HTTPException(status_code=404, detail="Destination not found")
    return db_update


@app.delete("/destinations/delete_destination/{id}")
def delete_destination(id: int, db: Session = Depends(get_db)):
    deleted = destinationServices.delete_destination(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Destination not found")
    return {"message": "Destination deleted successfully"}


@app.post('/wishlist/add', response_model=wishlistSchemas.WishList)
def create_wishlist(wishlist: wishlistSchemas.WishListCreated, db: Session = Depends(get_db)):
    return wishlistServices.create_wishlist(db, wishlist)


@app.get('/wishlist/{touristId}', response_model=wishlistSchemas.WishList)
def get_wishlist_by_id(touristId: int, db: Session = Depends(get_db)):
    return wishlistServices.get_wishlist(db, touristId)


@app.patch("/wishlist/{wishlist_id}/update-destinations", response_model=wishlistSchemas.WishList)
def update_wishlist_destinations(wishlist_id: int, new_destinations: List[str], db: Session = Depends(get_db)):
    updated_wishlist = wishlistServices.update_wishlist(db, wishlist_id, new_destinations)
    if not updated_wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")
    return updated_wishlist


@app.post("/selected-destinations/add", response_model=selectedDestinationsSchemas.SelectedDestinations)
def create_selected_destinations_list(selectedDestinations: selectedDestinationsSchemas.SelectedDestinationsCreated,
                                      db: Session = Depends(get_db)):
    return selectedDestinationsServices.create_selected_destinations_list(db, selectedDestinations)


@app.get("/selected-destinations/{touristId}", response_model=selectedDestinationsSchemas.SelectedDestinations)
def get_selected_destinations_list(touristId: int, db: Session = Depends(get_db)):
    return selectedDestinationsServices.get_selected_destinations_list(db, touristId)


@app.patch("/selected-destinations/{selected_destination_list_id}/updated-selected-destinations",
           response_model=selectedDestinationsSchemas.SelectedDestinations)
def update_selected_destinations_list(selected_destination_list_id: int, new_selected_destinations: List[str],
                                      db: Session = Depends(get_db)):
    updated_list = selectedDestinationsServices.update_selected_destinations_list(db, selected_destination_list_id,
                                                                                  new_selected_destinations)
    if not updated_list:
        raise HTTPException(status_code=404, detail="Wishlist not found")
    return updated_list


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
def update_trip_payment_status(tripId: int, payment_update: tripSchemas.TripPaymentStatusUpdate, db: Session = Depends(get_db)):
    updated_payment_status = tripServices.update_trip_payment_status(db, tripId, payment_update)
    if not updated_payment_status:
        raise HTTPException(status_code=404, detail="Trip not found")
    return updated_payment_status
