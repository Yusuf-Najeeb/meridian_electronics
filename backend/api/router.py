from fastapi import APIRouter
from api.routes.health import router as health_router
from modules.customer_agent.router import router as customer_agent_router



router = APIRouter(prefix="/api/v1")
router.include_router(health_router)
router.include_router(customer_agent_router)