from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default="user") # 'user' or 'admin'
    join_date = Column(DateTime, default=datetime.datetime.utcnow)

    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    price = Column(Float)
    description = Column(String)
    long_description = Column(String, nullable=True)
    image = Column(String)
    ingredients = Column(JSON) # Stores list of strings
    is_popular = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    rating = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    
    add_ons = Column(JSON) # Stores list of AddOn objects

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="Pending") # Pending, Processing, Completed, Cancelled
    subtotal = Column(Float)
    discount_amount = Column(Float)
    total = Column(Float)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
    name = Column(String)
    quantity = Column(Integer)
    price = Column(Float)
    selected_options = Column(JSON) # Stores addons selected

    order = relationship("Order", back_populates="items")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
    rating = Column(Integer)
    comment = Column(String)
    
    user = relationship("User", back_populates="reviews")
