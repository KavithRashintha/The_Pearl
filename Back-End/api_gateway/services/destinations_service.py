from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter()
DEST_SERVICE_URL = "http://localhost:8002"


async def _make_request(method: str, endpoint: str, **kwargs):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(method, f"{DEST_SERVICE_URL}{endpoint}", **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            detail = e.response.json().get("detail", "Error occurred")
            raise HTTPException(status_code=e.response.status_code, detail=detail)
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Destination service unavailable")


# Destination routes
@router.get("/")
async def get_all_destinations():
    return await _make_request("GET", "/destinations/")


@router.get("/{id}")
async def get_destination(id: int):
    return await _make_request("GET", f"/destinations/destination/{id}")


@router.post("/add")
async def add_destination(destination: dict):
    return await _make_request("POST", "/destinations/add", json=destination)


@router.put("/update_destination/{id}")
async def update_destination(id: int, destination: dict):
    return await _make_request("PUT", f"/destinations/update_destination/{id}", json=destination)


@router.delete("/delete_destination/{id}")
async def delete_destination(id: int):
    return await _make_request("DELETE", f"/destinations/delete_destination/{id}")


# Wishlist routes
@router.post("/wishlist/add")
async def create_wishlist(wishlist: dict):
    return await _make_request("POST", "/wishlist/add", json=wishlist)


@router.get("/wishlist/{touristId}")
async def get_wishlist(touristId: int):
    return await _make_request("GET", f"/wishlist/{touristId}")


@router.patch("/wishlist/{wishlist_id}/update-destinations")
async def update_wishlist_destinations(wishlist_id: int, new_destinations: list):
    return await _make_request("PATCH",
                               f"/wishlist/{wishlist_id}/update-destinations",
                               json={"new_destinations": new_destinations}
                               )


# Selected Destinations routes
@router.post("/selected-destinations/add")
async def create_selected_destinations(selected_destinations: dict):
    return await _make_request("POST", "/selected-destinations/add", json=selected_destinations)


@router.get("/selected-destinations/{touristId}")
async def get_selected_destinations(touristId: int):
    return await _make_request("GET", f"/selected-destinations/{touristId}")


@router.patch("/selected-destinations/{list_id}/updated-selected-destinations")
async def update_selected_destinations(list_id: int, new_selected_destinations: list):
    return await _make_request("PATCH",
                               f"/selected-destinations/{list_id}/updated-selected-destinations",
                               json={"new_selected_destinations": new_selected_destinations}
                               )
