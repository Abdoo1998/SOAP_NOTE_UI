from database import SessionLocal
from models import SoapNoteDB

def test_db_connection():
    db = SessionLocal()
    try:
        # Try to create a test record
        test_note = SoapNoteDB(
            patient_id="test123",
            patient_name="John Doe",
            content="Test SOAP Note"
        )
        db.add(test_note)
        db.commit()
        
        # Query it back
        result = db.query(SoapNoteDB).filter(SoapNoteDB.patient_id == "test123").first()
        print(f"Test record created with ID: {result.id}")
        
        # Clean up
        db.delete(result)
        db.commit()
        
        print("Database connection test successful!")
    except Exception as e:
        print(f"Database test failed: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    test_db_connection() 