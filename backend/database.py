from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Default to local postgres. Change the credentials here if yours are different.
# Format: postgresql://username:password@localhost:5432/db_name
# If you are using a different user/pass, please update the string below.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres@localhost:5432/niloufer_db")

 
# engine = create_engine(SQLALCHEMY_DATABASE_URL)

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    # Test connection
    with engine.connect() as connection:
        print(f"Successfully connected to database: {SQLALCHEMY_DATABASE_URL.split('@')[1]}")
except Exception as e:
    print(f"CRITICAL ERROR: Could not connect to database. Please check your credentials.\nError: {e}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
