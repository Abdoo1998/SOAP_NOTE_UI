from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import assemblyai as aai
from langchain_openai import ChatOpenAI ,AzureChatOpenAI
from langchain.prompts import PromptTemplate
import os
import logging
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from schemas import UserCreate, UserResponse, Token, LoginRequest
from database import SessionLocal, engine
from models import SoapNoteDB, User
from passlib.context import CryptContext

from auth import authenticate_user, create_access_token, get_current_user
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
from langchain_google_genai import ChatGoogleGenerativeAI
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
logger.info("Environment variables loaded")

# Pydantic model for request validation
class SoapNoteCreate(BaseModel):
    patient_id: str
    patient_name: str
    content: str

    class Config:
        from_attributes = True

# Set up FastAPI
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up AssemblyAI
aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")
transcriber = aai.Transcriber()
logger.info("AssemblyAI initialized")

# Set up LangChain with OpenAI as primary and Gemini as fallback
try:
    logger.info("Initializing OpenAI LLM")
    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0,
        api_key=os.getenv("OPENAI_API_KEY")
    )
    # llama = ChatLlamaAPI(os.getenv("LLAMA_API_KEY"))
    logger.info("OpenAI LLM initialized successfully")
    # llm=ChatLlamaAPI(clint=llama)
except Exception as e:
    logger.error(f"Failed to initialize OpenAI LLM: {str(e)}")
    try:
        logger.info("Falling back to Gemini LLM")
        # llm = ChatGoogleGenerativeAI(
        #     model="gemini-1.5-pro",
        #     temperature=0,
        #     api_key=os.getenv("GEMINI_API_KEY")
        # )
        logger.info("Gemini LLM initialized successfully")
    except Exception as e2:
        logger.error(f"Failed to initialize fallback Gemini LLM: {str(e2)}")
        raise Exception("No LLM available: Please check your LLM configuration") from e2

# Updated SOAP note template with enhanced accuracy and representation requirements
soap_template = """
# SOAP Note Template

You are an experienced medical professional creating a comprehensive SOAP note from a patient encounter transcript. Please follow these guidelines:

## Key Requirements:
- Extract information ONLY from the provided transcript - do not invent or assume details
- If no transcript is provided or it's empty, respond with: "No transcript provided. Unable to generate SOAP note without patient encounter data."
- Use clear, hierarchical organization with proper medical terminology
- Include specific measurements with units (vital signs, lab values, etc.)
- Document timestamps when available
- Highlight critical findings or concerns in **bold**

## SOAP Structure:

### Subjective
- Chief Complaint: Primary concern and duration
- History of Present Illness: Onset, progression, related symptoms
- Past Medical History: Chronic conditions, surgeries, hospitalizations
- Medications: Names, dosages, frequency
- Allergies: Medication and environmental with reactions
- Family History: Relevant conditions in relatives
- Social History: Occupation, living situation, habits (smoking, alcohol, etc.)
- Review of Systems: Pertinent positive and negative findings by system

### Objective
- Vital Signs: BP, HR, temp, RR, O2 sat, weight/BMI
- Physical Examination: Organized by body system
- Laboratory Results: Recent labs with values and reference ranges
- Diagnostic Studies: Imaging, ECG, or other test results

### Assessment
- Primary Diagnosis: With supporting evidence and reasoning

### Differential Diagnoses
- List each potential diagnosis with complete ICD-11 code (format: XX##.#)
- Include full ICD-11 description for each code
- Document supporting evidence from patient data for each differential
- Rank differentials in order of clinical likelihood with percentages
- For each differential, include key distinguishing features

### Plan
- Medications: New, modified, or discontinued with specific instructions
- Diagnostic Testing: Ordered tests with rationale
- Treatments/Procedures: Interventions recommended or performed
- Referrals: Specialist consultations needed
- Patient Education: Instructions and information provided
- Follow-up: Timing and purpose of next visit

### Conclusion
- Case Summary: Brief overview of key findings and main concerns
- Diagnostic Reasoning: Summary of why primary diagnosis was selected
- Treatment Strategy: Rationale for chosen interventions
- Prognosis: Expected course and outcomes
- Follow-up Priorities: Most important aspects to address at next visit

## Important Notes:
1. Maintain patient confidentiality in all documentation
2. Use evidence-based reasoning and standard medical practices
3. Document objectively without personal bias
4. Include pertinent negatives that help rule out differential diagnoses

Please generate a comprehensive SOAP note based on the following transcript:
{transcript}
"""
prompt = PromptTemplate(
    input_variables=["transcript"],
    template=soap_template
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Register route
@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Registration attempt for email: {user.email}")
    try:
        db_user = db.query(User).filter(User.email == user.email).first()
        if db_user:
            logger.warning(f"Registration failed: Email already exists: {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        
        username_exists = db.query(User).filter(User.username == user.username).first()
        if username_exists:
            logger.warning(f"Registration failed: Username already taken: {user.username}")
            raise HTTPException(status_code=400, detail="Username already taken")
        
        hashed_password = get_password_hash(user.password)
        new_user = User(
            email=user.email,
            username=user.username,
            job=user.job,
            hashed_password=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info(f"User registered successfully: {user.email}")
        return new_user
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise

# Login route
@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    logger.info(f"Login attempt for email: {request.email}")
    try:
        user = authenticate_user(db, request.email, request.password)
        if not user:
            logger.warning(f"Login failed: Invalid credentials for {request.email}")
            raise HTTPException(status_code=400, detail="Invalid email or password")
        
        access_token = create_access_token(data={"sub": user.email})
        logger.info(f"User logged in successfully: {request.email}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "job": user.job
            }
        }
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...), language: str = 'ar', db: Session = Depends(get_db)):
    logger.info(f"Starting transcription for file: {file.filename}, language: {language}")
    try:
        # Create temp directory if it doesn't exist
        temp_dir = "temp_files"
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
            logger.info(f"Created temp directory: {temp_dir}")
        
        # Generate unique filename
        temp_file_path = os.path.join(temp_dir, f"temp_audio_{os.urandom(8).hex()}.wav")
        logger.info(f"Temporary file path: {temp_file_path}")
        
        try:
            # Save the uploaded file temporarily
            logger.info("Saving uploaded file")
            with open(temp_file_path, "wb") as buffer:
                contents = await file.read()
                if not contents:
                    logger.error("Empty file uploaded")
                    raise HTTPException(status_code=400, detail="Empty file uploaded")
                buffer.write(contents)
            
            # Transcribe the audio
            logger.info("Starting AssemblyAI transcription")
            config = aai.TranscriptionConfig(
                language_code=language,
                speech_model=aai.SpeechModel.nano
            )
            transcript = transcriber.transcribe(temp_file_path, config)
            
            if not transcript or not transcript.text:
                logger.error("Transcription failed or returned empty result")
                raise HTTPException(status_code=500, detail="Transcription failed or returned empty result")
            
            logger.info("Transcription successful, generating SOAP note")
            # Generate SOAP note
            soap_note = llm.invoke(
                prompt.format(transcript=transcript.text)
            )
            
            if not soap_note or not soap_note.content:
                logger.error("SOAP note generation failed")
                raise HTTPException(status_code=500, detail="SOAP note generation failed")
            
            logger.info("SOAP note generated successfully")
            return {"soap_note": soap_note.content}
            
        except Exception as e:
            logger.error(f"Error during processing: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
                logger.info(f"Cleaned up temporary file: {temp_file_path}")
            
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/soap-notes/")
async def create_soap_note(soap_note: SoapNoteCreate, db: Session = Depends(get_db)):
    try:
        db_soap_note = SoapNoteDB(
            patient_id=soap_note.patient_id,
            patient_name=soap_note.patient_name,
            content=soap_note.content
        )
        db.add(db_soap_note)
        db.commit()
        db.refresh(db_soap_note)
        return {
            "id": db_soap_note.id,
            "patient_id": db_soap_note.patient_id,
            "patient_name": db_soap_note.patient_name,
            "content": db_soap_note.content,
            "created_at": db_soap_note.created_at
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/soap-notes/{patient_id}")
async def get_soap_notes(patient_id: str, db: Session = Depends(get_db)):
    try:
        soap_notes = db.query(SoapNoteDB).filter(
            SoapNoteDB.patient_id == patient_id
        ).all()
        
        return [{
            "id": note.id,
            "patient_id": note.patient_id,
            "patient_name": note.patient_name,
            "content": note.content,
            "created_at": note.created_at
        } for note in soap_notes]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/soap-notes/")
async def get_all_soap_notes(db: Session = Depends(get_db)):
    try:
        # Query all soap notes, ordered by creation date (newest first)
        soap_notes = db.query(SoapNoteDB).order_by(SoapNoteDB.created_at.desc()).all()
        
        return [{
            "id": note.id,
            "patient_id": note.patient_id,
            "patient_name": note.patient_name,
            "content": note.content,
            "created_at": note.created_at
        } for note in soap_notes]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-patient-case")
async def analyze_patient_case(patient_identifier: str, search_by: str = "id", db: Session = Depends(get_db)):
    try:
        # Search by patient ID or name
        if search_by == "name":
            soap_notes = db.query(SoapNoteDB).filter(
                SoapNoteDB.patient_name == patient_identifier
            ).order_by(SoapNoteDB.created_at.desc()).all()
        else:
            soap_notes = db.query(SoapNoteDB).filter(
                SoapNoteDB.patient_id == patient_identifier
            ).order_by(SoapNoteDB.created_at.desc()).all()

        if not soap_notes:
            raise HTTPException(status_code=404, detail="No SOAP notes found for this patient")

        # Combine all SOAP notes into a single text for analysis
        combined_notes = "\n\n".join([
            f"Date: {note.created_at}\n{note.content}" 
            for note in soap_notes
        ])

        # Create analysis prompt
        analysis_prompt = f"""
        Please analyze the following patient's SOAP notes and provide:
        1. A summary of the patient's medical history
        2. Key findings and patterns across visits 
        3. Notable changes in condition over time
        4. Potential areas of concern
        5. Recommendations for follow-up

        SOAP Notes:
        {combined_notes}
        """

        # Get AI analysis
        analysis = llm.invoke(analysis_prompt)
        # Check if the response is a string or an object with a content attribute
        analysis_text = analysis if isinstance(analysis, str) else analysis.content

        return {
            "patient_identifier": patient_identifier,
            "search_by": search_by,
            "number_of_notes": len(soap_notes),
            "analysis": analysis_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    logger.info(f"User info requested for: {current_user.email}")
    return current_user

if __name__ == "__main__":
    logger.info("Starting FastAPI application")
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
