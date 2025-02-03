from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import assemblyai as aai
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from schemas import UserCreate, UserResponse, Token, LoginRequest
from database import SessionLocal, engine
from models import SoapNoteDB, User
from passlib.context import CryptContext
from auth import authenticate_user, create_access_token
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
from langchain_google_genai import ChatGoogleGenerativeAI
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Load environment variables
load_dotenv()

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

# # Set up LangChain with OpenAI
# llm = ChatOpenAI(
#     model="gpt-4o",
#     temperature=0,
#     api_key=os.getenv("OPENAI_API_KEY")
# )

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-002",
    temperature=0,
    api_key=os.getenv("GEMINI_API_KEY")
)

# SOAP note template
soap_template = """
# SOAP Note Template

You are an experienced medical professional tasked with creating a comprehensive and precise SOAP note. Generate a detailed clinical documentation from the provided transcript, adhering to the following structured format:

## Subjective
• Chief Complaint (if mentioned):
  - Primary concern with exact duration (days/weeks/months)
  - Pain scale rating (if applicable, 0-10)
  - Pattern and timing of symptoms
• History of Present Illness (if mentioned):
  - Chronological progression of symptoms
  - Specific associated symptoms
  - Precise aggravating and alleviating factors
  - Previous treatments attempted
• Past Medical History (if mentioned):
  - Chronic conditions
  - Previous surgeries with dates
  - Relevant hospitalizations
• Current Medications (if mentioned):
  - Name (generic and brand)
  - Exact dosage and frequency
  - Duration of current regimen
  - Compliance history
• Allergies (if mentioned):
  - Medication allergies with specific reactions
  - Environmental/food allergies
  - Severity of reactions
• Family History (if mentioned):
  - First-degree relatives' conditions
  - Age of onset for hereditary conditions
  - Current status of family members
• Social History (if mentioned):
  - Occupation and work environment
  - Living situation and support system
  - Detailed habits:
    ∘ Smoking (packs/day, years)
    ∘ Alcohol (type, frequency, amount)
    ∘ Exercise routine
    ∘ Diet patterns
• Review of Systems (if mentioned):
  - Cardiovascular
  - Respiratory
  - Gastrointestinal
  - Musculoskeletal
  - Neurological
  - Other pertinent systems

## Objective
• Vital Signs (if mentioned):
  - Blood pressure (mmHg)
  - Heart rate (bpm)
  - Temperature (°C/°F)
  - Respiratory rate (breaths/min)
  - O2 saturation (%)
  - BMI
• Physical Examination (if mentioned):
  - General appearance
  - Mental status
  - Detailed cardiovascular exam:
    ∘ Heart sounds (S1/S2/murmurs)
    ∘ Peripheral pulses
    ∘ Edema assessment
  - Respiratory exam
  - Abdominal exam
  - Neurological exam
  - Skin assessment
• Laboratory Results (if mentioned):
  - Complete blood count
  - Metabolic panel
  - Cardiac enzymes
  - Other relevant tests
• Diagnostic Studies (if mentioned):
  - ECG findings
  - Imaging results
  - Other test results

## Assessment
• Primary Diagnosis (if mentioned):
  - Condition name with specificity (e.g., "Essential Hypertension, Stage 2, poorly controlled")
  - Severity/stage classification with detailed criteria:
    ∘ Clinical parameters
    ∘ Risk stratification 
    ∘ Disease progression indicators
  - Supporting evidence:
    ∘ Key symptoms and clinical findings
    ∘ Relevant test results
    ∘ Response to previous treatments
    ∘ Impact on patient's quality of life
  - Clinical reasoning:
    ∘ Key findings supporting diagnosis
    ∘ Risk stratification
    ∘ Disease progression assessment
  - Complications:
    ∘ Current complications
    ∘ Potential complications
    ∘ Risk factors

## Differential Diagnosis
• Primary Differential Diagnoses:
  - List of potential diagnoses in order of likelihood
  - For each diagnosis:
    ∘ ICD-11 code and complete description
    ∘ Supporting evidence and clinical findings
    ∘ Key distinguishing features
    ∘ Required confirmatory tests
• Secondary Differential Diagnoses:
  - Additional conditions to consider
  - Risk factors and predisposing conditions
  - Required screening or testing
• Critical "Must-Not-Miss" Diagnoses:
  - Life-threatening conditions to rule out
  - Red flag symptoms/signs
  - Emergency management considerations
• Diagnostic Approach:
  - Systematic evaluation strategy
  - Key diagnostic tests needed
  - Clinical decision points
  - Consultation requirements

## Plan
• Medications (if mentioned):
  - New prescriptions (name, dose, frequency, duration)
  - Modified medications
  - Discontinued medications
  - Reason for each change
• Diagnostic Testing (if mentioned):
  - Ordered tests with rationale
  - Expected timeframe
  - Specific instructions
• Interventions (if mentioned):
  - Procedures planned
  - Referrals with urgency level
  - Specialist consultations
• Patient Education (if mentioned):
  - Lifestyle modifications
  - Warning signs to monitor
  - Self-management instructions
• Follow-up (if mentioned):
  - Next appointment timing
  - Specific goals for next visit
  - Conditions for earlier return

## Conclusion
• Case Summary (if mentioned):
  - Brief overview of key findings
  - Main diagnostic considerations
  - Treatment strategy rationale
• Prognosis (if mentioned):
  - Expected outcomes
  - Recovery timeline
  - Long-term management needs
• Quality Metrics (if mentioned):
  - Care plan compliance
  - Outcome measures
  - Documentation completeness

---

### Critical Requirements:
1. Extract information ONLY from the provided transcript: {transcript}
2. Use standardized medical terminology and approved abbreviations following ICD-10 and SNOMED CT
3. Document with extreme precision - use specific measurements, values and descriptors
4. Maintain strict chronological order with clear timestamps for all historical events
5. Include exact measurements with SI units and reference ranges where applicable
6. Format using hierarchical bullet points and clear section headers for optimal readability
7. Emphasize cardiovascular findings with detailed descriptions of heart sounds, rhythms, and circulation
8. Establish clear connections between symptoms, signs, and diagnostic reasoning
9. Mark undocumented information as "Not reported in transcript" to ensure transparency
10. Follow standard medical documentation guidelines per Joint Commission requirements
11. Include pertinent negatives that help rule out differential diagnoses
12. Quantify all findings with objective measurements (e.g. pain scale 1-10, ROM in degrees)
13. Flag urgent/emergent conditions in bold with clear action items
14. Document patient's understanding, compliance, and barriers to treatment
15. Include precise time stamps for all critical events, medications, and interventions
16. Note any cultural or linguistic considerations affecting care
17. Document all patient education provided and comprehension verified
18. Include interdisciplinary communication and care coordination details
19. Note any pending results or follow-up items clearly
20. Document informed consent discussions and decisions

Note: Maintain absolute objectivity and accuracy. Do not include speculative information or assumptions. If information is not explicitly stated in the transcript, mark it as "Not documented" rather than making clinical assumptions.
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
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Login route
@app.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...), language: str = 'ar', db: Session = Depends(get_db)):
    try:
        # Save the uploaded file temporarily
        with open("temp_audio.wav", "wb") as buffer:
            buffer.write(await file.read())
        
        # Transcribe the audio
        config = aai.TranscriptionConfig(language_code=language, speech_model=aai.SpeechModel.nano)
        transcript = transcriber.transcribe("temp_audio.wav", config)

        # Generate SOAP note
        soap_note = llm.invoke(
            prompt.format(transcript=transcript.text)
        )

        # Clean up temporary file
        os.remove("temp_audio.wav")

        return {"soap_note": soap_note.content}
    except Exception as e:
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

        return {
            "patient_identifier": patient_identifier,
            "search_by": search_by,
            "number_of_notes": len(soap_notes),
            "analysis": analysis.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)