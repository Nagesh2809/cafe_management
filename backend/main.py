from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import models, schemas, database, auth
from fastapi.security import OAuth2PasswordBearer

# Ensure tables exist
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS Configuration
# Allow both localhost and 127.0.0.1 to prevent "Failed to fetch" errors
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173", # Vite default
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    yield from database.get_db()

# --- Auth Helpers ---
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except auth.JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(user: models.User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return user

# --- AUTH ROUTES ---

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    
    role = "admin" if "admin" in user.email.lower() else "user"
    
    new_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password,
        role=role,
        join_date=user.join_date or datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token", response_model=schemas.Token)
def login(form_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- MENU ROUTES ---

@app.get("/menu", response_model=List[schemas.MenuItem])
def get_menu(db: Session = Depends(get_db)):
    return db.query(models.MenuItem).all()

@app.get("/menu/popular", response_model=List[schemas.MenuItem])
def get_popular_menu(db: Session = Depends(get_db)):
    return db.query(models.MenuItem).filter(models.MenuItem.is_popular == True).limit(4).all()

@app.post("/menu", response_model=schemas.MenuItem)
def create_menu_item(item: schemas.MenuItemCreate, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    db_item = models.MenuItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/menu/{item_id}", response_model=schemas.MenuItem)
def update_menu_item(item_id: int, item: schemas.MenuItemCreate, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    db_item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    for key, value in item.dict().items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/menu/{item_id}")
def delete_menu_item(item_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    db_item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted"}

# --- ORDER ROUTES ---

@app.post("/orders", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "admin":
        raise HTTPException(status_code=400, detail="Admins cannot place orders")

    new_order = models.Order(
        user_id=current_user.id,
        subtotal=order.subtotal,
        discount_amount=order.discount_amount,
        total=order.total,
        status="Pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in order.items:
        try:
            # Handle potential ID type mismatch if frontend sends string
            menu_id = int(item.menu_item_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid Menu Item ID")

        db_item = models.OrderItem(
            order_id=new_order.id,
            menu_item_id=menu_id,
            name=item.name,
            quantity=item.quantity,
            price=item.price,
            selected_options=item.selected_options
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(new_order)
    return new_order

@app.get("/orders/me", response_model=List[schemas.OrderResponse])
def get_my_orders(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).order_by(models.Order.date.desc()).all()

# --- ADMIN ROUTES ---

@app.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    total_revenue = db.query(models.Order).with_entities(models.Order.total).all()
    revenue_sum = sum([r[0] for r in total_revenue]) if total_revenue else 0
    
    total_orders = db.query(models.Order).count()
    total_users = db.query(models.User).count()
    
    orders = db.query(models.Order).all()
    sales_history = {}
    for o in orders:
        d = o.date.strftime("%Y-%m-%d")
        sales_history[d] = sales_history.get(d, 0) + o.total
    
    sales_data = [{"date": k, "sales": v} for k, v in sales_history.items()]
    
    return {
        "revenue": revenue_sum,
        "orders": total_orders,
        "users": total_users,
        "sales_history": sales_data
    }

@app.get("/admin/orders", response_model=List[schemas.OrderResponse])
def get_all_orders(db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    return db.query(models.Order).order_by(models.Order.date.desc()).all()

@app.put("/admin/orders/{order_id}/status")
def update_order_status(order_id: int, status_update: dict, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status_update.get("status", order.status)
    db.commit()
    return {"message": "Status updated"}


if  __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)