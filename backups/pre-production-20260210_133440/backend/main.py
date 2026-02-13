# main.py - Production Optimized
import os
import logging
from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import time
import uvicorn

from app.database import engine, Base
from app.routers import auth, menu, orders, restaurant, websocket, reservations, tables, upload, ai_analytics
from app.config import settings

# ============ LOGGING ============
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ============ LIFESPAN ============
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting Smart Restaurant API...")
    Base.metadata.create_all(bind=engine)

    # Ensure uploads directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    yield
    logger.info("🔄 Shutting down...")


# ============ CREATE APP ============
app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
    # Disable docs in production for security
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
)


# ============ MIDDLEWARE ============

# 1. Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if settings.ENVIRONMENT == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# 2. Request Logging & Timing Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time

    if duration > 1.0:  # Log slow requests (>1s)
        logger.warning(
            f"SLOW REQUEST: {request.method} {request.url.path} - {duration:.2f}s"
        )

    return response


# 3. CORS - Configured per environment
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


# ============ STATIC FILES ============
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


# ============ ROUTERS ============
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(menu.router, prefix="/api/menu", tags=["Menu"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(restaurant.router, prefix="/api/restaurant", tags=["Restaurant"])
app.include_router(websocket.router, prefix="/api/ws", tags=["WebSocket"])
app.include_router(reservations.router, prefix="/api/reservations", tags=["Reservations"])
app.include_router(tables.router, prefix="/api/tables", tags=["Tables"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(ai_analytics.router, prefix="/api/ai", tags=["AI Analytics"])


# ============ HEALTH CHECK ============
@app.get("/")
async def root():
    return {"message": "Smart Restaurant API", "status": "running"}


@app.get("/health")
async def health_check():
    """Health check endpoint for Railway/Render deployment monitoring."""
    return {"status": "healthy", "environment": settings.ENVIRONMENT}


# ============ ENTRY POINT ============
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        reload=settings.DEBUG,
        workers=1 if settings.DEBUG else 4,
        log_level="debug" if settings.DEBUG else "info",
    )
