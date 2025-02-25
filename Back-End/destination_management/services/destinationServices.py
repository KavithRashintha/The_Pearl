from sqlalchemy.orm import Session
from schemas import destinationSchemas
from models.destinationModels import Destinations


def create_destination(db: Session, data: destinationSchemas.DestinationCreated):
    new_destination = Destinations(**data.model_dump())
    db.add(new_destination)
    db.commit()
    db.refresh(new_destination)
    return new_destination


def get_all_destinations(db: Session):
    return db.query(Destinations).all()


def get_destination(db: Session, destination_id: int):
    return db.query(Destinations).filter(Destinations.id == destination_id).first()


def update_destination(db: Session, destination: destinationSchemas.DestinationCreated, destination_id: int):
    retrieved_destination = db.query(Destinations).filter(Destinations.id == destination_id).first()
    if retrieved_destination:
        for key, value in destination.model_dump().items():
            setattr(retrieved_destination, key, value)
        db.commit()
        db.refresh(retrieved_destination)
        return retrieved_destination


def delete_destination(db: Session, destination_id: int):
    retrieved_destination = db.query(Destinations).filter(Destinations.id == destination_id).first()
    if retrieved_destination:
        db.delete(retrieved_destination)
        db.commit()
        return "Deleted"
