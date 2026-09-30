from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, AsyncSessionLocal
from app.services.seed_data import seed_database

# Routers
from app.routers import auth, red, blue, control, audit, observability, events, demo

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables if not exist and seed default accounts & sandboxes
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        await seed_database(session)

    yield

    # Shutdown
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Secure, isolated AI security laboratory with strict 4-pillar isolation.",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(red.router, prefix=settings.API_V1_STR)
app.include_router(blue.router, prefix=settings.API_V1_STR)
app.include_router(control.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)
app.include_router(observability.router, prefix=settings.API_V1_STR)
app.include_router(events.router, prefix=settings.API_V1_STR)
app.include_router(demo.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "pillars": [
            "Sandbox Isolation (Red / Blue / LLM / Control Zones)",
            "Policy Enforcement (RBAC server-side)",
            "Security Events (Normalized live telemetry)",
            "Audit & Evidence (SHA-256 Hash Chained Ledger)"
        ]
    }

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {"status": "HEALTHY", "environment": settings.ENVIRONMENT}
