# Backend Setup Guide (FastAPI + PostgreSQL)

## 1. Prerequisites
- Python 3.9+
- PostgreSQL installed and running
- A created database named `niloufer_db` (or whatever you prefer)

## 2. Setup
1. Navigate to the `backend` folder.
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Database:
   - Open `backend/database.py`
   - Update `SQLALCHEMY_DATABASE_URL` with your credentials:
     `postgresql://<username>:<password>@localhost:5432/<dbname>`

## 3. Initialize Database
Run the initialization script to create tables and seed default data:
```bash
python init_db.py
```

## 4. Run Server
```bash
uvicorn main:app --reload
```
The API will run at `http://localhost:8000`.
Swagger Docs: `http://localhost:8000/docs`.

## 5. Admin Login
- Email: `admin@niloufer.com`
- Password: `admin123`
