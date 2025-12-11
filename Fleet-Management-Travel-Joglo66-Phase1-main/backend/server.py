from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Import routers
from auth import auth_router
from vehicles import vehicles_router
from maintenance import maintenance_router, work_orders_router
from drivers import drivers_router
from fuel import fuel_router
from parts import parts_router
from tires import tires_router
from inspections import inspections_router
from alerts import alerts_router
from dashboard import dashboard_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Inject db into all modules
import auth, vehicles, maintenance, drivers, fuel, parts, tires, inspections, alerts, dashboard
auth.db = db
vehicles.db = db
maintenance.db = db
drivers.db = db
fuel.db = db
parts.db = db
tires.db = db
inspections.db = db
alerts.db = db
dashboard.db = db

# Create the main app without a prefix
app = FastAPI(title="Fleet Management API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "Fleet Management API v1.0"}

# Include all routers
api_router.include_router(auth_router)
api_router.include_router(vehicles_router)
api_router.include_router(maintenance_router)
api_router.include_router(work_orders_router)
api_router.include_router(drivers_router)
api_router.include_router(fuel_router)
api_router.include_router(parts_router)
api_router.include_router(tires_router)
api_router.include_router(inspections_router)
api_router.include_router(alerts_router)
api_router.include_router(dashboard_router)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()