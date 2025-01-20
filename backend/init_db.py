from database import engine, Base
from models import SoapNoteDB

def init_db():
    print("Creating database tables...")
    try:
        # This will create all tables that inherit from Base
        Base.metadata.drop_all(bind=engine)  # First drop all tables to ensure clean state
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Error creating database tables: {str(e)}")

if __name__ == "__main__":
    init_db() 