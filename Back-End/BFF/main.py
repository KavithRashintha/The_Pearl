import uvicorn
from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from starlette.middleware.cors import CORSMiddleware
from schemas import proxySchema
from services import proxyService
from typing import List, Optional

app = FastAPI(title="API Gateway BFF")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/trips/add", response_model=proxySchema.Trip, tags=["Trips"])
async def create_trip(trip: proxySchema.TripCreated):
    return await proxyService.create_trip(trip)

@app.get("/api/trips/", response_model=List[proxySchema.Trip], tags=["Trips"])
async def get_all_trips():
    return await proxyService.get_all_trips()

@app.get("/api/trips/trip-by-tourist/{touristId}", response_model=List[proxySchema.Trip], tags=["Trips"])
async def get_trips_by_tourist(touristId: int):
    return await proxyService.get_trips_by_tourist(touristId)

@app.get("/api/trips/trip-by-tour-guide/{tourGuideId}", response_model=List[proxySchema.Trip], tags=["Trips"])
async def get_trips_by_guide(tourGuideId: int):
    return await proxyService.get_trips_by_guide(tourGuideId)

@app.get("/api/trips/trip-by-tourist/{touristId}/completed", response_model=List[proxySchema.Trip], tags=["Trips"])
async def get_completed_trips(touristId: int):
    return await proxyService.get_completed_trips_by_tourist(touristId)

@app.patch('/api/trips/{tripId}/update-trip-status', response_model=proxySchema.Trip, tags=["Trips"])
async def update_trip_status(tripId: int, status_update: proxySchema.TripStatusUpdate):
    return await proxyService.update_trip_status(tripId, status_update)

@app.patch('/api/trips/{tripId}/update-payment-status', response_model=proxySchema.Trip, tags=["Trips"])
async def update_payment_status(tripId: int, payment_update: proxySchema.TripPaymentStatusUpdate):
    return await proxyService.update_payment_status(tripId, payment_update)

@app.post("/api/destinations/add", response_model=proxySchema.Destination, tags=["Destinations"])
async def add_destination(destination: proxySchema.DestinationCreated):
    return await proxyService.add_destination(destination)

@app.get("/api/destinations/", response_model=List[proxySchema.Destination], tags=["Destinations"])
async def get_all_destinations():
    return await proxyService.get_all_destinations()

@app.get("/api/destinations/destination/{id}", response_model=proxySchema.Destination, tags=["Destinations"])
async def get_destination_by_id(id: int):
    return await proxyService.get_destination_by_id(id)

@app.put("/api/destinations/update_destination/{id}", response_model=proxySchema.Destination, tags=["Destinations"])
async def update_destination(id: int, destination: proxySchema.DestinationCreated):
    return await proxyService.update_destination(id, destination)

@app.delete("/api/destinations/delete_destination/{id}", status_code=status.HTTP_200_OK, tags=["Destinations"])
async def delete_destination(id: int):
    await proxyService.delete_destination(id)
    return {"message": "Destination deleted successfully"}

@app.post('/api/wishlist/add', response_model=proxySchema.WishList, tags=["Wishlist"])
async def create_wishlist(wishlist: proxySchema.WishListCreated):
    return await proxyService.create_wishlist(wishlist)

@app.get('/api/wishlist/{touristId}', response_model=Optional[proxySchema.WishList], tags=["Wishlist"])
async def get_wishlist(touristId: int):
    return await proxyService.get_wishlist(touristId)

@app.patch("/api/wishlist/{wishlist_id}/update-destinations", response_model=proxySchema.WishList, tags=["Wishlist"])
async def update_wishlist(wishlist_id: int, new_destinations: List[int]):
    return await proxyService.update_wishlist(wishlist_id, new_destinations)

@app.post("/api/selected-destinations/add", response_model=proxySchema.SelectedDestinations, tags=["Selected Destinations"])
async def create_selected_list(selectedDestinations: proxySchema.SelectedDestinationsCreated):
    return await proxyService.create_selected_list(selectedDestinations)

@app.get("/api/selected-destinations/{touristId}", response_model=Optional[proxySchema.SelectedDestinations], tags=["Selected Destinations"])
async def get_selected_list(touristId: int):
    return await proxyService.get_selected_list(touristId)

@app.patch("/api/selected-destinations/{list_id}/updated-selected-destinations", response_model=proxySchema.SelectedDestinations, tags=["Selected Destinations"])
async def update_selected_list(list_id: int, new_selected_destinations: List[int]):
    return await proxyService.update_selected_list(list_id, new_selected_destinations)

@app.post("/api/auth/register/tourist", status_code=status.HTTP_201_CREATED, tags=["Authentication"])
async def register_tourist(tourist_reg_data: proxySchema.TouristRegistration):
    return await proxyService.register_tourist(tourist_reg_data)

@app.post("/api/auth/register/guide", status_code=status.HTTP_201_CREATED, tags=["Authentication"])
async def register_guide(guide_reg_data: proxySchema.TourGuideRegistration):
    return await proxyService.register_guide(guide_reg_data)

@app.post("/api/auth/register/admin", status_code=status.HTTP_201_CREATED, tags=["Authentication"])
async def register_admin(admin_reg_data: proxySchema.AdminRegistration):
    return await proxyService.register_admin(admin_reg_data)

@app.post("/api/auth/token", response_model=proxySchema.Token, tags=["Authentication"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    form_dict = {"username": form_data.username, "password": form_data.password, "scope": form_data.scopes}
    return await proxyService.get_token(form_dict)

@app.get("/api/users/me", response_model=proxySchema.UserDetails, tags=["Users"])
async def read_current_user_profile(request: Request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    return await proxyService.get_current_user(auth_header)

@app.get("/api/users/tour-guides", response_model=List[proxySchema.TourGuide], tags=["Users"])
async def read_tour_guides():
    return await proxyService.get_all_guides()

@app.get("/api/tourists/{user_id}/profile", response_model=proxySchema.UserDetails, tags=["Tourists"])
async def read_tourist_profile(user_id: int):
    return await proxyService.get_tourist_profile(user_id)

@app.get("/api/tour-guide/{user_id}/profile", response_model=proxySchema.UserDetails, tags=["Tour Guides"])
async def read_tour_guide_profile(user_id: int):
    return await proxyService.get_tour_guide_profile(user_id)

@app.patch("/api/tourists/{user_id}/profile", response_model=proxySchema.UserDetails, tags=["Tourists"])
async def update_tourist_profile(user_id: int, profile_data: proxySchema.TouristProfileUpdate):
    return await proxyService.update_tourist_profile(user_id, profile_data)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)