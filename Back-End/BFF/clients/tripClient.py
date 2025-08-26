import httpx
from schemas import proxySchema

TRIP_SERVICE_URL = "http://localhost:8002"

async def handle_request(method: str, url: str, **kwargs):
    async with httpx.AsyncClient() as client:
        response = await client.request(method, url, **kwargs)
        response.raise_for_status()
        if response.status_code == 204 or not response.content:
            return None
        return response.json()

async def create_trip(trip: proxySchema.TripCreated):
    return await handle_request("POST", f"{TRIP_SERVICE_URL}/trips/add", json=trip.model_dump())

async def get_all_trips():
    return await handle_request("GET", f"{TRIP_SERVICE_URL}/trips/")

async def get_trips_by_tourist(touristId: int):
    return await handle_request("GET", f"{TRIP_SERVICE_URL}/trips/trip-by-tourist/{touristId}")

async def get_trips_by_guide(tourGuideId: int):
    return await handle_request("GET", f"{TRIP_SERVICE_URL}/trips/trip-by-tour-guide/{tourGuideId}")

async def get_completed_trips_by_tourist(touristId: int):
    return await handle_request("GET", f"{TRIP_SERVICE_URL}/trips/trip-by-tourist/{touristId}/completed")

async def update_trip_status(tripId: int, status_update: proxySchema.TripStatusUpdate):
    return await handle_request("PATCH", f"{TRIP_SERVICE_URL}/trips/{tripId}/update-trip-status", json=status_update.model_dump())

async def update_payment_status(tripId: int, payment_update: proxySchema.TripPaymentStatusUpdate):
    return await handle_request("PATCH", f"{TRIP_SERVICE_URL}/trips/{tripId}/update-payment-status", json=payment_update.model_dump())

async def get_pending_trips_by_tour_guide(tour_guide_id: int):
    return await handle_request("GET", f"{TRIP_SERVICE_URL}/trips/trip-by-tour-guide/{tour_guide_id}/pending")

async def get_accepted_trips_by_tour_guide(tour_guide_id: int):
    return await handle_request("GET", f"{TRIP_SERVICE_URL}/trips/trip-by-tour-guide/{tour_guide_id}/accepted")

async def get_started_trips_by_tour_guide(tour_guide_id: int):
    return await handle_request("GET", f"{TRIP_SERVICE_URL}/trips/trip-by-tour-guide/{tour_guide_id}/started")

async def get_completed_trips_by_tour_guide(tour_guide_id: int):
    return await handle_request("GET", f"{TRIP_SERVICE_URL}/trips/trip-by-tour-guide/{tour_guide_id}/completed")