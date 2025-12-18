# app/routers/menu.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import MenuItem, Category, User
from app.schemas import (
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemResponse,
    CategoryCreate,
    CategoryResponse
)
from app.utils.auth import get_current_active_user, get_admin_user

router = APIRouter()


# ============ MENU ITEMS ============
@router.get("", response_model=List[MenuItemResponse])
async def get_menu_items(
    category_id: Optional[int] = None,
    is_available: Optional[bool] = None,
    is_vegetarian: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all menu items with optional filters."""
    query = db.query(MenuItem)
    
    if category_id:
        query = query.filter(MenuItem.category_id == category_id)
    if is_available is not None:
        query = query.filter(MenuItem.is_available == is_available)
    if is_vegetarian is not None:
        query = query.filter(MenuItem.is_vegetarian == is_vegetarian)
    
    menu_items = query.offset(skip).limit(limit).all()
    return menu_items


@router.get("/{item_id}", response_model=MenuItemResponse)
async def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    """Get a specific menu item by ID."""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    return item


@router.post("", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
async def create_menu_item(
    item_data: MenuItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Create a new menu item (Admin only)."""
    # Verify category exists
    category = db.query(Category).filter(Category.id == item_data.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    new_item = MenuItem(**item_data.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.put("/{item_id}", response_model=MenuItemResponse)
async def update_menu_item(
    item_id: int,
    item_data: MenuItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Update a menu item (Admin only)."""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    # Update only provided fields
    update_data = item_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)
    
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Delete a menu item (Admin only)."""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    db.delete(item)
    db.commit()
    return None


# ============ CATEGORIES ============
@router.get("/categories/all", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    """Get all menu categories."""
    categories = db.query(Category).filter(Category.is_active == True).all()
    return categories


@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Create a new category (Admin only)."""
    # Check if category already exists
    existing = db.query(Category).filter(Category.name == category_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category already exists"
        )
    
    new_category = Category(**category_data.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category
