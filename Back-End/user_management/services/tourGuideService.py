from sqlalchemy.orm import Session
from models import tourGuideModels, userModels

def get_all_tour_guides(db: Session):
    tour_guides = db.query(tourGuideModels.TourGuide).all()

    result = []
    for guide in tour_guides:
        user = db.query(userModels.User).filter(userModels.User.id == guide.userId).first()

        guide_data = {
            "id": guide.id,
            "userId": guide.userId,
            "nic": guide.nic,
            "telephone": guide.telephone,
            "address": guide.address,
            "licenseNumber": guide.licenseNumber,
            "reviewCount": guide.reviewCount,
            "name": user.name if user else "Unknown"
        }
        result.append(guide_data)

    return result

def get_tour_guide_profile(db: Session, user_id: int, ):
    return db.query(userModels.User).filter(userModels.User.id == user_id).first()