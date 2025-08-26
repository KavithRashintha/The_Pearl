from clients import tripClient, destinationClient, userClient
from schemas import proxySchema
from typing import List, Dict
import asyncio

async def create_trip(trip: proxySchema.TripCreated): return await tripClient.create_trip(trip)

async def get_all_trips(): return await tripClient.get_all_trips()

async def get_trips_by_tourist(touristId: int): return await tripClient.get_trips_by_tourist(touristId)

async def get_trips_by_guide(tourGuideId: int): return await tripClient.get_trips_by_guide(tourGuideId)

async def _enrich_trips_with_tourist_info(trips: List[Dict]) -> List[Dict]:
    if not trips:
        return []

    tasks = [userClient.get_tourist_profile(trip["touristId"]) for trip in trips]
    tourist_profiles_results = await asyncio.gather(*tasks, return_exceptions=True)
    profile_map = {
        profile['id']: profile
        for profile in tourist_profiles_results
        if not isinstance(profile, Exception) and isinstance(profile, dict)
    }
    for trip in trips:
        profile = profile_map.get(trip["touristId"])
        trip["touristName"] = profile.get("name", "Tourist Not Found") if profile else "Tourist Not Found"

    return trips

async def get_pending_trips_for_tour_guide(tour_guide_id: int):
    pending_trips = await tripClient.get_pending_trips_by_tour_guide(tour_guide_id)
    return await _enrich_trips_with_tourist_info(pending_trips)
async def get_accepted_trips_for_tour_guide(tour_guide_id: int):
    accepted_trips = await tripClient.get_accepted_trips_by_tour_guide(tour_guide_id)
    return await _enrich_trips_with_tourist_info(accepted_trips)

async def get_started_trips_for_tour_guide(tour_guide_id: int):
    started_trips = await tripClient.get_started_trips_by_tour_guide(tour_guide_id)
    return await _enrich_trips_with_tourist_info(started_trips)
async def get_completed_trips_for_tour_guide(tour_guide_id: int):
    completed_trips = await tripClient.get_completed_trips_by_tour_guide(tour_guide_id)
    return await _enrich_trips_with_tourist_info(completed_trips)

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

async def get_tour_guide_profile(user_id: int): return await userClient.get_tour_guide_profile(user_id)

async def update_tourist_profile(user_id: int, data: proxySchema.TouristProfileUpdate): return await userClient.update_tourist_profile(user_id, data)

async def update_tour_guide_profile(user_id: int, data: proxySchema.TourGuideProfileUpdate): return await userClient.update_tour_guide_profile(user_id, data)

