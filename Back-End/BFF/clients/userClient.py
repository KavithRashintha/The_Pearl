import httpx
from typing import Dict
from schemas import proxySchema

USER_SERVICE_URL = "http://localhost:8001"

async def handle_request(method: str, url: str, **kwargs):
    async with httpx.AsyncClient() as client:
        response = await client.request(method, url, **kwargs)
        response.raise_for_status()
        if response.status_code == 204 or not response.content:
            return None
        return response.json()

async def register_tourist(data: proxySchema.TouristRegistration):
    return await handle_request("POST", f"{USER_SERVICE_URL}/auth/register/tourist", json=data.model_dump())

async def register_guide(data: proxySchema.TourGuideRegistration):
    return await handle_request("POST", f"{USER_SERVICE_URL}/auth/register/guide", json=data.model_dump())

async def register_admin(data: proxySchema.AdminRegistration):
    return await handle_request("POST", f"{USER_SERVICE_URL}/auth/register/admin", json=data.model_dump())

async def get_token(form_data: Dict[str, str]):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{USER_SERVICE_URL}/auth/token", data=form_data)
        response.raise_for_status()
        return response.json()

async def get_current_user(token: str):
    headers = {"Authorization": token}
    return await handle_request("GET", f"{USER_SERVICE_URL}/users/me", headers=headers)

async def get_all_guides():
    return await handle_request("GET", f"{USER_SERVICE_URL}/users/tour-guides")

async def get_tourist_profile(user_id: int):
    return await handle_request("GET", f"{USER_SERVICE_URL}/tourists/{user_id}/profile")

async def get_tour_guide_profile(user_id: int):
    return await handle_request("GET", f"{USER_SERVICE_URL}/tour-guide/{user_id}/profile")

async def update_tourist_profile(user_id: int, data: proxySchema.TouristProfileUpdate):
    return await handle_request("PATCH", f"{USER_SERVICE_URL}/tourists/{user_id}/profile", json=data.model_dump(exclude_unset=True))