from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database import Base

class SoapNoteDB(Base):
    __tablename__ = "soap_notes"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String(50), index=True)
    patient_name = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<SoapNote(id={self.id}, patient_id={self.patient_id}, patient_name={self.patient_name})>" 


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
