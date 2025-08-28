from sqlalchemy.orm import Session, joinedload
from models import tourGuideModels, userModels
from schemas import tourGuideSchema

def get_all_tour_guides(db: Session):
    tour_guides = db.query(tourGuideModels.TourGuide).options(
        joinedload(tourGuideModels.TourGuide.user)
    ).all()

    result = []
    for guide in tour_guides:
        if guide.user:
            guide_data = {
                "id": guide.id,
                "userId": guide.userId,
                "nic": guide.nic,
                "telephone": guide.telephone,
                "address": guide.address,
                "licenseNumber": guide.licenseNumber,
                "reviewCount": guide.reviewCount,
                "name": guide.user.name,
                "email": guide.user.email,
                "profilePicture": guide.user.profilePicture
            }
            result.append(guide_data)

    return result

def get_tour_guide_profile(db: Session, user_id: int ):
    return db.query(userModels.User).filter(userModels.User.id == user_id).first()

def update_tour_guide_profile(db: Session, user_id: int, update_data: tourGuideSchema.TourGuideProfileUpdate):
    db_user = get_tour_guide_profile(db, user_id)
    if not db_user or not db_user.tour_guide:
        return None

    update_dict = update_data.model_dump(exclude_unset=True)

    for key, value in update_dict.items():
        if key in ["name", "email"]:
            setattr(db_user, key, value)
        elif hasattr(db_user.tour_guide, key):
            setattr(db_user.tour_guide, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

def delete_tour_guide(db: Session, user_id: int):
    retrieved_guide = db.query(userModels.User).filter(userModels.User.id == user_id).first()
    if retrieved_guide:
        db.delete(retrieved_guide)
        db.commit()
        return"Deleted"