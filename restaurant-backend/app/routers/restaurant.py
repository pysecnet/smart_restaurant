# app/routers/restaurant.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict

from app.database import get_db
from app.models import Restaurant, User, Order, MenuItem, OrderStatus
from app.schemas import RestaurantUpdate, RestaurantResponse
from app.utils.auth import get_admin_user

router = APIRouter()


@router.get("/info", response_model=RestaurantResponse)
async def get_restaurant_info(db: Session = Depends(get_db)):
    """Get restaurant information."""
    restaurant = db.query(Restaurant).first()
    
    if not restaurant:
        # Create default restaurant info if doesn't exist
        restaurant = Restaurant(
            name="Smart Restaurant",
            description="Welcome to our restaurant!",
            is_open=True
        )
        db.add(restaurant)
        db.commit()
        db.refresh(restaurant)
    
    return restaurant


@router.put("/info", response_model=RestaurantResponse)
async def update_restaurant_info(
    update_data: RestaurantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Update restaurant information (Admin only)."""
    restaurant = db.query(Restaurant).first()
    
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant info not found"
        )
    
    # Update only provided fields
    update_values = update_data.model_dump(exclude_unset=True)
    for key, value in update_values.items():
        setattr(restaurant, key, value)
    
    db.commit()
    db.refresh(restaurant)
    return restaurant


@router.get("/stats", response_model=Dict)
async def get_restaurant_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Get restaurant statistics (Admin only)."""
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == OrderStatus.PENDING).count()
    completed_orders = db.query(Order).filter(Order.status == OrderStatus.DELIVERED).count()
    total_menu_items = db.query(MenuItem).count()
    available_items = db.query(MenuItem).filter(MenuItem.is_available == True).count()
    
    # Calculate total revenue from completed orders
    total_revenue = db.query(Order).filter(
        Order.status == OrderStatus.DELIVERED
    ).with_entities(
        db.func.sum(Order.total_amount)
    ).scalar() or 0.0
    
    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "completed_orders": completed_orders,
        "total_menu_items": total_menu_items,
        "available_items": available_items,
        "total_revenue": float(total_revenue)
    }
