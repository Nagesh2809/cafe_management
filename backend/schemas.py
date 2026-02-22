from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

# --- Token ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

# --- User ---
class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str
    join_date: Optional[datetime] = None # For demo purposes

class UserResponse(UserBase):
    id: int
    role: str
    join_date: datetime
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str

# --- Menu ---
class MenuItemBase(BaseModel):
    name: str
    category: str
    price: float
    description: str
    image: str
    is_available: bool

class MenuItemCreate(MenuItemBase):
    long_description: Optional[str] = None
    ingredients: List[str] = []
    add_ons: List[dict] = []
    is_popular: bool = False

class MenuItem(MenuItemBase):
    id: int
    long_description: Optional[str] = None
    ingredients: Optional[List[str]] = []
    add_ons: Optional[List[dict]] = []
    is_popular: bool
    rating: Optional[float] = 0.0
    class Config:
        from_attributes = True

# --- Order ---
class OrderItemCreate(BaseModel):
    menu_item_id: int
    name: str
    quantity: int
    price: float
    selected_options: List[dict] = []

class OrderCreate(BaseModel):
    subtotal: float
    discount_amount: float
    total: float
    items: List[OrderItemCreate]

class OrderItem(BaseModel):
    id: int
    name: str
    quantity: int
    price: float
    selected_options: Optional[List[dict]] = []
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    date: datetime
    status: str
    subtotal: float
    discount_amount: float
    total: float
    items: List[OrderItem]
    class Config:
        from_attributes = True
