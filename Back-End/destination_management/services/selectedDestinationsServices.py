from sqlalchemy.orm import Session
from schemas import selectedDestinationsSchemas
from models.selectedDestinationsModels import SelectedDestinations
from typing import List


def create_selected_destinations_list(db: Session, data: selectedDestinationsSchemas.SelectedDestinationsCreated):
    new_list = SelectedDestinations(**data.model_dump())
    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    return new_list


def get_selected_destinations_list(db: Session, tourist_id: int):
    return db.query(SelectedDestinations).filter(SelectedDestinations.touristId == tourist_id).first()


def update_selected_destinations_list(db: Session, selected_list_id: int, new_selected_list: List[str]):
    selected_list = db.query(SelectedDestinations).filter(SelectedDestinations.id == selected_list_id).first()

    if selected_list:
        selected_list.selectedDestinations = new_selected_list
        db.commit()
        db.refresh(selected_list)
        return selected_list
    return None
