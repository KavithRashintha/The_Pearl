import httpx
from typing import List
from schemas import proxySchema

DESTINATION_SERVICE_URL = "http://localhost:8000"

async def handle_request(method: str, url: str, **kwargs):
    async with httpx.AsyncClient() as client:
        response = await client.request(method, url, **kwargs)
        response.raise_for_status()
        if response.status_code == 204 or not response.content:
            return None
        return response.json()

async def add_destination(destination: proxySchema.DestinationCreated):
    return await handle_request("POST", f"{DESTINATION_SERVICE_URL}/destinations/add", json=destination.model_dump())

async def get_all_destinations():
    return await handle_request("GET", f"{DESTINATION_SERVICE_URL}/destinations/")

async def get_destination_by_id(destination_id: int):
    return await handle_request("GET", f"{DESTINATION_SERVICE_URL}/destinations/destination/{destination_id}")

async def get_destinations_count():
    return await handle_request("GET", f"{DESTINATION_SERVICE_URL}/api/destinations/count")

async def update_destination(destination_id: int, destination: proxySchema.DestinationCreated):
    return await handle_request("PUT", f"{DESTINATION_SERVICE_URL}/destinations/update_destination/{destination_id}", json=destination.model_dump())

async def delete_destination(destination_id: int):
    return await handle_request("DELETE", f"{DESTINATION_SERVICE_URL}/destinations/delete_destination/{destination_id}")

async def create_wishlist(wishlist: proxySchema.WishListCreated):
    return await handle_request("POST", f"{DESTINATION_SERVICE_URL}/wishlist/add", json=wishlist.model_dump())

async def get_wishlist(touristId: int):
    return await handle_request("GET", f"{DESTINATION_SERVICE_URL}/wishlist/{touristId}")

async def update_wishlist(wishlist_id: int, new_destinations: List[int]):
    return await handle_request("PATCH", f"{DESTINATION_SERVICE_URL}/wishlist/{wishlist_id}/update-destinations", json=new_destinations)

async def create_selected_list(selected_list: proxySchema.SelectedDestinationsCreated):
    return await handle_request("POST", f"{DESTINATION_SERVICE_URL}/selected-destinations/add", json=selected_list.model_dump())

async def get_selected_list(touristId: int):
    return await handle_request("GET", f"{DESTINATION_SERVICE_URL}/selected-destinations/{touristId}")

async def update_selected_list(list_id: int, new_list: List[int]):
    return await handle_request("PATCH", f"{DESTINATION_SERVICE_URL}/selected-destinations/{list_id}/updated-selected-destinations", json=new_list)