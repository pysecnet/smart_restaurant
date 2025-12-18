# app/routers/tables.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Table, User
from app.schemas import TableCreate, TableUpdate, TableResponse
from app.utils.auth import get_admin_user

router = APIRouter()


@router.get("/", response_model=List[TableResponse])
async def get_tables(db: Session = Depends(get_db)):
    """Get all tables."""
    tables = db.query(Table).all()
    
    # Convert datetime to string
    return [
        {
            "id": t.id,
            "number": t.number,
            "capacity": t.capacity,
            "status": t.status,
            "qr_code": t.qr_code,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "updated_at": t.updated_at.isoformat() if t.updated_at else None
        }
        for t in tables
    ]


@router.post("/", response_model=None, status_code=status.HTTP_201_CREATED)
async def create_table(
    table_data: TableCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Create a new table (Admin only)."""
    # Check if table number already exists
    existing = db.query(Table).filter(Table.number == table_data.number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Table number already exists"
        )
    
    # Generate QR code URL
    from app.config import settings
    base_url = getattr(settings, 'BASE_URL', 'http://localhost:3000')
    qr_code = f"{base_url}/menu?table={table_data.number}"
    
    # Create table
    db_table = Table(
        number=table_data.number,
        capacity=table_data.capacity,
        status="available",
        qr_code=qr_code
    )
    
    db.add(db_table)
    db.commit()
    db.refresh(db_table)
    
    return {
        "id": db_table.id,
        "number": db_table.number,
        "capacity": db_table.capacity,
        "status": db_table.status,
        "qr_code": db_table.qr_code,
        "created_at": db_table.created_at.isoformat() if db_table.created_at else None,
        "updated_at": db_table.updated_at.isoformat() if db_table.updated_at else None
    }


@router.get("/{table_id}", response_model=None)
async def get_table(table_id: int, db: Session = Depends(get_db)):
    """Get a specific table."""
    table = db.query(Table).filter(Table.id == table_id).first()
    if not table:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Table not found"
        )
    
    return {
        "id": table.id,
        "number": table.number,
        "capacity": table.capacity,
        "status": table.status,
        "qr_code": table.qr_code,
        "created_at": table.created_at.isoformat() if table.created_at else None,
        "updated_at": table.updated_at.isoformat() if table.updated_at else None
    }


@router.put("/{table_id}", response_model=None)
async def update_table(
    table_id: int,
    table_data: TableUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Update a table (Admin only)."""
    table = db.query(Table).filter(Table.id == table_id).first()
    if not table:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Table not found"
        )
    
    # Update fields
    if table_data.number:
        # Check if new number already exists
        existing = db.query(Table).filter(
            Table.number == table_data.number,
            Table.id != table_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Table number already exists"
            )
        table.number = table_data.number
        
        # Update QR code with new number
        from app.config import settings
        base_url = getattr(settings, 'BASE_URL', 'http://localhost:3000')
        table.qr_code = f"{base_url}/menu?table={table_data.number}"
    
    if table_data.capacity:
        table.capacity = table_data.capacity
    
    if table_data.status:
        table.status = table_data.status
    
    db.commit()
    db.refresh(table)
    
    return {
        "id": table.id,
        "number": table.number,
        "capacity": table.capacity,
        "status": table.status,
        "qr_code": table.qr_code,
        "created_at": table.created_at.isoformat() if table.created_at else None,
        "updated_at": table.updated_at.isoformat() if table.updated_at else None
    }


@router.delete("/{table_id}", response_model=None)
async def delete_table(
    table_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Delete a table (Admin only)."""
    table = db.query(Table).filter(Table.id == table_id).first()
    if not table:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Table not found"
        )
    
    db.delete(table)
    db.commit()
    
    return {"message": "Table deleted successfully"}
