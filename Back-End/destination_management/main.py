from fastapi import FastAPI, Depends, HTTPException
from schemas import destinationSchemas
from services import destinationServices
from db import get_db
from sqlalchemy.orm import Session

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
