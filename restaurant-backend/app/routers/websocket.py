# app/routers/websocket.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, Depends
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import logging

from app.websocket import manager
from app.config import settings
from app.database import get_db
from app.models import User

router = APIRouter()
logger = logging.getLogger(__name__)


async def get_user_from_token(token: str, db: Session) -> User:
    """Verify WebSocket token and get user."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        
        user = db.query(User).filter(User.email == email).first()
        return user
    except JWTError:
        return None


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint for real-time updates.
    
    Connect with: ws://localhost:8000/api/ws?token=YOUR_JWT_TOKEN
    """
    # Verify token and get user
    user = await get_user_from_token(token, db)
    
    if not user:
        await websocket.close(code=1008, reason="Invalid authentication token")
        return
    
    # Determine user role
    role = user.role
    
    # Accept connection
    await manager.connect(websocket, role)
    
    try:
        # Send welcome message
        await manager.send_personal_message({
            "type": "connection_established",
            "message": f"Connected as {role}",
            "user": {
                "id": user.id,
                "username": user.username,
                "role": role
            }
        }, websocket)
        
        # Listen for messages
        while True:
            data = await websocket.receive_json()
            
            # Handle different message types
            if data.get("type") == "subscribe_order":
                order_id = data.get("order_id")
                if order_id:
                    manager.subscribe_to_order(websocket, order_id)
                    await manager.send_personal_message({
                        "type": "subscribed",
                        "order_id": order_id,
                        "message": f"Subscribed to order #{order_id}"
                    }, websocket)
            
            elif data.get("type") == "ping":
                await manager.send_personal_message({
                    "type": "pong",
                    "timestamp": data.get("timestamp")
                }, websocket)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, role)
        logger.info(f"User {user.username} ({role}) disconnected")
    
    except Exception as e:
        logger.error(f"WebSocket error for user {user.username}: {e}")
        manager.disconnect(websocket, role)
        await websocket.close(code=1011, reason="Internal server error")
