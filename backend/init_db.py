from database import engine, SessionLocal
import models
import auth
from datetime import datetime

# Initialize Database Tables
def init():
    print("Creating tables...")
    models.Base.metadata.create_all(bind=engine)
    print("Tables created.")

    db = SessionLocal()

    # Seed Admin User
    admin_email = "admin@niloufer.com"
    if not db.query(models.User).filter(models.User.email == admin_email).first():
        print("Seeding Admin User...")
        admin = models.User(
            email=admin_email,
            name="Super Admin",
            hashed_password=auth.get_password_hash("admin123"),
            role="admin",
            join_date=datetime.utcnow()
        )
        db.add(admin)
    
    # Seed Menu Items if empty
    if db.query(models.MenuItem).count() == 0:
        print("Seeding Menu Items...")
        menu_items = [
            {
                "name": "Classic Irani Chai",
                "category": "Chai",
                "price": 30.0,
                "description": "Our signature strong tea brewed with creamy milk and secret spices.",
                "long_description": "The soul of Hyderabad. A robust blend of premium dust tea dust, boiled for hours with creamy milk and a hint of secret spices.",
                "ingredients": ["Assam Tea Dust", "Full Cream Buffalo Milk", "Sugar", "Secret Spice Blend", "Water"],
                "image": "https://images.unsplash.com/photo-1626818599456-5c93540d9d4f?q=80&w=800&auto=format&fit=crop",
                "is_popular": True,
                "is_available": True,
                "rating": 4.9,
                "add_ons": [
                    {"name": "Extra Milk", "price": 10, "type": "toggle"},
                    {"name": "Less Sugar", "price": 0, "type": "toggle"},
                    {"name": "Sugar Free", "price": 5, "type": "toggle"},
                    {"name": "Extra Cardamom", "price": 5, "type": "toggle"}
                ]
            },
            {
                "name": "Osmania Biscuits",
                "category": "Bakery",
                "price": 150.0,
                "description": "The legendary salt-sweet biscuits that melt in your mouth.",
                "ingredients": ["Refined Flour (Maida)", "Butter", "Sugar", "Salt", "Milk Solids"],
                "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop",
                "is_popular": True,
                "is_available": True,
                "rating": 4.8,
                "add_ons": [{"name": "Extra Butter Dip", "price": 10, "type": "toggle"}]
            },
            {
                "name": "Bun Maska",
                "category": "Bakery",
                "price": 45.0,
                "description": "Soft sweet bun slathered with generous homemade butter.",
                "ingredients": ["Refined Flour", "Yeast", "Sugar", "Salt", "Butter (Maska)", "Milk"],
                "image": "https://images.unsplash.com/photo-1606456070389-c48c3e80034b?q=80&w=800&auto=format&fit=crop",
                "is_popular": True,
                "is_available": True,
                "rating": 4.7,
                "add_ons": [
                    {"name": "Extra Butter", "price": 15, "type": "quantity", "maxQuantity": 2},
                    {"name": "Extra Bun", "price": 35, "type": "quantity", "maxQuantity": 2},
                    {"name": "Fruit Jam", "price": 10, "type": "toggle"}
                ]
            },
            {
                "name": "Malai Bun",
                "category": "Bakery",
                "price": 60.0,
                "description": "Fresh bun topped with thick, fresh cream (Malai) and sugar.",
                "ingredients": ["Refined Flour", "Fresh Cream (Malai)", "Sugar", "Milk"],
                "image": "https://images.unsplash.com/photo-1560155016-bd4879ae8f21?q=80&w=800&auto=format&fit=crop",
                "is_popular": True,
                "is_available": True,
                "rating": 4.9,
                "add_ons": [{"name": "Extra Malai", "price": 20, "type": "quantity"}]
            },
            {
                "name": "Veg Samosa (Onion)",
                "category": "Snacks",
                "price": 25.0,
                "description": "Crispy pastry filled with spicy onion masala.",
                "ingredients": ["Maida", "Onion", "Green Chillies", "Spices", "Oil"],
                "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
                "is_popular": False,
                "is_available": True,
                "rating": 4.5,
                "add_ons": [{"name": "Mint Chutney", "price": 10, "type": "toggle"}]
            }
        ]

        for item_data in menu_items:
            db_item = models.MenuItem(**item_data)
            db.add(db_item)
    
    db.commit()
    db.close()
    print("Seeding complete.")

if __name__ == "__main__":
    init()
