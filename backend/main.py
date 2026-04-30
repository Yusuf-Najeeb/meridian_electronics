# app.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from agents import set_default_openai_client, set_default_openai_api, set_tracing_disabled
from agents.mcp import MCPServerManager
from app_mcp.server import order_server
from config import settings, configure_logging, engine, logger
from config.db import Base
from api.router import router
from api.middlewares.error_handler import global_error_handler
from api.middlewares.request_logger import request_logger

# Startup / shutdown lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    Base.metadata.create_all(bind=engine)

    client = AsyncOpenAI(api_key=settings.openrouter_api_key, base_url=settings.base_url)
    set_default_openai_client(client)
    set_default_openai_api("chat_completions")
    set_tracing_disabled(True)

    async with MCPServerManager([order_server]) as mcp_manager:
        app.state.mcp_servers = mcp_manager.active_servers
        if not app.state.mcp_servers:
            logger.error(
                "No MCP servers connected; customer agent tools unavailable. "
                "Errors: %s",
                {s.name: mcp_manager.errors.get(s) for s in mcp_manager.failed_servers},
            )
        yield


# App instance
app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    lifespan=lifespan,
)
app.middleware("http")(request_logger)
app.middleware("http")(global_error_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
