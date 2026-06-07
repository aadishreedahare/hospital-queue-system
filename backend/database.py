from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:aadishri@localhost:5432/hospital_db"

engine = create_engine(DATABASE_URL)

connection = engine.connect()

print("Database Connected Successfully!")