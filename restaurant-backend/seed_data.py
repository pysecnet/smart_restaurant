# seed_data.py
"""
Seed script to populate the database with initial data.
Run with: python seed_data.py (from project root)
"""
import sys
import os
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Verify we can import
try:
    from sqlalchemy.orm import Session
    from app.database import SessionLocal, engine, Base
    from app.models import User, Category, MenuItem, Restaurant, UserRole
    from app.utils.auth import get_password_hash
    import logging
except ImportError as e:
    print(f"❌ Import error: {e}")
    print(f"Current directory: {os.getcwd()}")
    print(f"Python path: {sys.path}")
    print("\n🔧 Make sure you're running from the project root:")
    print("   cd restaurant-backend")
    print("   python seed_data.py")
    sys.exit(1)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_admin_user(db: Session):
    """Create default admin user."""
    admin = db.query(User).filter(User.email == "admin@restaurant.com").first()
    
    if not admin:
        admin = User(
            email="admin@restaurant.com",
            username="admin",
            full_name="Admin User",
            phone="+1234567890",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin)
        db.commit()
        logger.info("✅ Admin user created (email: admin@restaurant.com, password: admin123)")
    else:
        logger.info("ℹ️  Admin user already exists")
    
    return admin


def create_test_customer(db: Session):
    """Create a test customer."""
    customer = db.query(User).filter(User.email == "customer@test.com").first()
    
    if not customer:
        customer = User(
            email="customer@test.com",
            username="testcustomer",
            full_name="Test Customer",
            phone="+9876543210",
            hashed_password=get_password_hash("customer123"),
            role=UserRole.CUSTOMER,
            is_active=True
        )
        db.add(customer)
        db.commit()
        logger.info("✅ Test customer created (email: customer@test.com, password: customer123)")
    else:
        logger.info("ℹ️  Test customer already exists")
    
    return customer


def create_restaurant_info(db: Session):
    """Create restaurant information."""
    restaurant = db.query(Restaurant).first()
    
    if not restaurant:
        restaurant = Restaurant(
            name="Smart Restaurant",
            description="Experience the future of dining with our smart ordering system. Fresh ingredients, innovative dishes, and seamless service.",
            address="123 Main Street, Food District, City 12345",
            phone="+1-555-FOOD-123",
            email="info@smartrestaurant.com",
            opening_time="10:00 AM",
            closing_time="11:00 PM",
            logo_url="https://via.placeholder.com/200x200?text=Smart+Restaurant",
            is_open=True
        )
        db.add(restaurant)
        db.commit()
        logger.info("✅ Restaurant info created")
    else:
        logger.info("ℹ️  Restaurant info already exists")
    
    return restaurant


def create_categories(db: Session):
    """Create menu categories."""
    categories_data = [
        {
            "name": "Appetizers",
            "description": "Start your meal with our delicious appetizers",
            "image_url": "https://via.placeholder.com/300x200?text=Appetizers"
        },
        {
            "name": "Main Course",
            "description": "Hearty and satisfying main dishes",
            "image_url": "https://via.placeholder.com/300x200?text=Main+Course"
        },
        {
            "name": "Desserts",
            "description": "Sweet endings to your perfect meal",
            "image_url": "https://via.placeholder.com/300x200?text=Desserts"
        },
        {
            "name": "Beverages",
            "description": "Refreshing drinks and specialty beverages",
            "image_url": "https://via.placeholder.com/300x200?text=Beverages"
        },
        {
            "name": "Salads",
            "description": "Fresh and healthy salad options",
            "image_url": "https://via.placeholder.com/300x200?text=Salads"
        }
    ]
    
    categories = []
    for cat_data in categories_data:
        category = db.query(Category).filter(Category.name == cat_data["name"]).first()
        if not category:
            category = Category(**cat_data, is_active=True)
            db.add(category)
            categories.append(category)
            logger.info(f"✅ Category created: {cat_data['name']}")
        else:
            categories.append(category)
            logger.info(f"ℹ️  Category already exists: {cat_data['name']}")
    
    db.commit()
    return categories


def create_menu_items(db: Session, categories: list):
    """Create sample menu items."""
    # Get category IDs
    appetizers_id = next(c.id for c in categories if c.name == "Appetizers")
    main_course_id = next(c.id for c in categories if c.name == "Main Course")
    desserts_id = next(c.id for c in categories if c.name == "Desserts")
    beverages_id = next(c.id for c in categories if c.name == "Beverages")
    salads_id = next(c.id for c in categories if c.name == "Salads")
    
    menu_items_data = [
        # Appetizers
        {"name": "Spring Rolls", "description": "Crispy vegetable spring rolls with sweet chili sauce", 
         "price": 8.99, "category_id": appetizers_id, "is_vegetarian": True, "preparation_time": 10, "calories": 250},
        {"name": "Chicken Wings", "description": "Spicy buffalo wings with ranch dressing", 
         "price": 12.99, "category_id": appetizers_id, "is_spicy": True, "preparation_time": 15, "calories": 450},
        {"name": "Mozzarella Sticks", "description": "Golden fried mozzarella with marinara sauce", 
         "price": 9.99, "category_id": appetizers_id, "is_vegetarian": True, "preparation_time": 12, "calories": 380},
        
        # Main Course
        {"name": "Grilled Salmon", "description": "Fresh Atlantic salmon with lemon butter sauce", 
         "price": 24.99, "category_id": main_course_id, "preparation_time": 25, "calories": 520},
        {"name": "Beef Burger", "description": "Angus beef patty with cheese, lettuce, tomato", 
         "price": 15.99, "category_id": main_course_id, "preparation_time": 20, "calories": 680},
        {"name": "Margherita Pizza", "description": "Classic pizza with tomato, mozzarella, basil", 
         "price": 14.99, "category_id": main_course_id, "is_vegetarian": True, "preparation_time": 18, "calories": 580},
        {"name": "Chicken Pasta", "description": "Creamy Alfredo pasta with grilled chicken", 
         "price": 16.99, "category_id": main_course_id, "preparation_time": 22, "calories": 720},
        {"name": "Vegetable Stir Fry", "description": "Mixed vegetables in teriyaki sauce with rice", 
         "price": 13.99, "category_id": main_course_id, "is_vegetarian": True, "preparation_time": 15, "calories": 420},
        
        # Salads
        {"name": "Caesar Salad", "description": "Romaine lettuce with Caesar dressing and croutons", 
         "price": 10.99, "category_id": salads_id, "is_vegetarian": True, "preparation_time": 8, "calories": 280},
        {"name": "Greek Salad", "description": "Fresh vegetables with feta cheese and olives", 
         "price": 11.99, "category_id": salads_id, "is_vegetarian": True, "preparation_time": 8, "calories": 250},
        
        # Desserts
        {"name": "Chocolate Lava Cake", "description": "Warm chocolate cake with molten center", 
         "price": 8.99, "category_id": desserts_id, "is_vegetarian": True, "preparation_time": 12, "calories": 480},
        {"name": "Tiramisu", "description": "Classic Italian dessert with coffee and mascarpone", 
         "price": 9.99, "category_id": desserts_id, "is_vegetarian": True, "preparation_time": 5, "calories": 420},
        {"name": "Ice Cream Sundae", "description": "Vanilla ice cream with chocolate sauce and nuts", 
         "price": 7.99, "category_id": desserts_id, "is_vegetarian": True, "preparation_time": 5, "calories": 380},
        
        # Beverages
        {"name": "Fresh Orange Juice", "description": "Freshly squeezed orange juice", 
         "price": 5.99, "category_id": beverages_id, "is_vegetarian": True, "preparation_time": 3, "calories": 110},
        {"name": "Cappuccino", "description": "Espresso with steamed milk foam", 
         "price": 4.99, "category_id": beverages_id, "is_vegetarian": True, "preparation_time": 5, "calories": 120},
        {"name": "Iced Tea", "description": "Refreshing iced tea with lemon", 
         "price": 3.99, "category_id": beverages_id, "is_vegetarian": True, "preparation_time": 2, "calories": 90},
        {"name": "Mojito Mocktail", "description": "Mint, lime, and soda water", 
         "price": 6.99, "category_id": beverages_id, "is_vegetarian": True, "preparation_time": 5, "calories": 150},
    ]
    
    for item_data in menu_items_data:
        existing_item = db.query(MenuItem).filter(MenuItem.name == item_data["name"]).first()
        if not existing_item:
            item_data["image_url"] = f"https://via.placeholder.com/400x300?text={item_data['name'].replace(' ', '+')}"
            item_data["is_available"] = True
            menu_item = MenuItem(**item_data)
            db.add(menu_item)
            logger.info(f"✅ Menu item created: {item_data['name']}")
        else:
            logger.info(f"ℹ️  Menu item already exists: {item_data['name']}")
    
    db.commit()


def seed_database():
    """Main seeding function."""
    logger.info("🌱 Starting database seeding...")
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Create users
        create_admin_user(db)
        create_test_customer(db)
        
        # Create restaurant info
        create_restaurant_info(db)
        
        # Create categories
        categories = create_categories(db)
        
        # Create menu items
        create_menu_items(db, categories)
        
        logger.info("✅ Database seeding completed successfully!")
        logger.info("\n📝 Login Credentials:")
        logger.info("   Admin:    admin@restaurant.com / admin123")
        logger.info("   Customer: customer@test.com / customer123")
        
    except Exception as e:
        logger.error(f"❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
