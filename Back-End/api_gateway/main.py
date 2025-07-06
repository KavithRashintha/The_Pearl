from fastapi import FastAPI
from services import destinations_service, trip_service, user_service

app = FastAPI()

app.include_router(destinations_service.router, prefix="/api/destinations", tags=["Destinations"])

