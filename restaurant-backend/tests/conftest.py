# tests/conftest.py
"""
Pytest configuration and fixtures for testing.
Run with: pytest -v
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from app.database import Base, get_db
from app.models import User, Category, MenuItem, Restaurant
from app.utils.auth import get_password_hash

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with overridden DB dependency."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def admin_user(db_session):
    """Create an admin user for testing."""
    user = User(
        email="admin@test.com",
        username="admin",
        full_name="Admin User",
        hashed_password=get_password_hash("admin123"),
        role="admin",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def customer_user(db_session):
    """Create a customer user for testing."""
    user = User(
        email="customer@test.com",
        username="customer",
        full_name="Customer User",
        hashed_password=get_password_hash("customer123"),
        role="customer",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def admin_token(client, admin_user):
    """Get JWT token for admin user."""
    response = client.post("/api/auth/login", json={
        "email": "admin@test.com",
        "password": "admin123"
    })
    return response.json()["access_token"]


@pytest.fixture
def customer_token(client, customer_user):
    """Get JWT token for customer user."""
    response = client.post("/api/auth/login", json={
        "email": "customer@test.com",
        "password": "customer123"
    })
    return response.json()["access_token"]


@pytest.fixture
def sample_category(db_session):
    """Create a sample category."""
    category = Category(
        name="Test Category",
        description="Test Description",
        is_active=True
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    return category


@pytest.fixture
def sample_menu_item(db_session, sample_category):
    """Create a sample menu item."""
    item = MenuItem(
        name="Test Burger",
        description="Delicious test burger",
        price=12.99,
        category_id=sample_category.id,
        is_available=True,
        is_vegetarian=False,
        preparation_time=15
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item


@pytest.fixture
def restaurant_info(db_session):
    """Create restaurant information."""
    restaurant = Restaurant(
        name="Test Restaurant",
        description="Test Description",
        is_open=True
    )
    db_session.add(restaurant)
    db_session.commit()
    db_session.refresh(restaurant)
    return restaurant
