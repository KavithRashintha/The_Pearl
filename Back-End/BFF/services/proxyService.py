from clients import tripClient, destinationClient, userClient
from schemas import proxySchema
from typing import List, Dict

async def create_trip(trip: proxySchema.TripCreated): return await tripClient.create_trip(trip)

async def get_all_trips(): return await tripClient.get_all_trips()

async def get_trips_by_tourist(touristId: int): return await tripClient.get_trips_by_tourist(touristId)

async def get_trips_by_guide(tourGuideId: int): return await tripClient.get_trips_by_guide(tourGuideId)

async def get_completed_trips_by_tourist(touristId: int): return await tripClient.get_completed_trips_by_tourist(touristId)

async def update_trip_status(tripId: int, status_update: proxySchema.TripStatusUpdate): return await tripClient.update_trip_status(tripId, status_update)

async def update_payment_status(tripId: int, payment_update: proxySchema.TripPaymentStatusUpdate): return await tripClient.update_payment_status(tripId, payment_update)

async def add_destination(destination: proxySchema.DestinationCreated): return await destinationClient.add_destination(destination)

async def get_all_destinations(): return await destinationClient.get_all_destinations()

async def get_destination_by_id(id: int): return await destinationClient.get_destination_by_id(id)

async def update_destination(id: int, destination: proxySchema.DestinationCreated): return await destinationClient.update_destination(id, destination)

async def delete_destination(id: int): return await destinationClient.delete_destination(id)

async def create_wishlist(wishlist: proxySchema.WishListCreated): return await destinationClient.create_wishlist(wishlist)

async def get_wishlist(touristId: int): return await destinationClient.get_wishlist(touristId)

async def update_wishlist(wishlist_id: int, destinations: List[int]): return await destinationClient.update_wishlist(wishlist_id, destinations)

async def create_selected_list(selected_list: proxySchema.SelectedDestinationsCreated): return await destinationClient.create_selected_list(selected_list)

async def get_selected_list(touristId: int): return await destinationClient.get_selected_list(touristId)

async def update_selected_list(list_id: int, new_list: List[int]): return await destinationClient.update_selected_list(list_id, new_list)

async def register_tourist(data: proxySchema.TouristRegistration): return await userClient.register_tourist(data)

async def register_guide(data: proxySchema.TourGuideRegistration): return await userClient.register_guide(data)

async def register_admin(data: proxySchema.AdminRegistration): return await userClient.register_admin(data)

async def get_token(form_data: Dict[str, str]): return await userClient.get_token(form_data)

async def get_current_user(token: str): return await userClient.get_current_user(token)

async def get_all_guides(): return await userClient.get_all_guides()

async def get_tourist_profile(user_id: int): return await userClient.get_tourist_profile(user_id)

async def update_tourist_profile(user_id: int, data: proxySchema.TouristProfileUpdate): return await userClient.update_tourist_profile(user_id, data)