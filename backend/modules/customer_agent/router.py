from fastapi import APIRouter, Request
from modules.customer_agent.schema import CustomerAgentRequest, CustomerAgentResponse
from modules.customer_agent.service import run_customer_agent

router = APIRouter(prefix="/customer-agent", tags=["customer-agent"])

@router.post("/chat/", response_model=CustomerAgentResponse, status_code=200)
async def chat(request: Request, data: CustomerAgentRequest):
    mcp_servers = getattr(request.app.state, "mcp_servers", [])
    return await run_customer_agent(data, mcp_servers)