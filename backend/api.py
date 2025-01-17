from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import assemblyai as aai
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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
aai.settings.api_key = "ca9031d75ccf4bccb3e7ec52cbe0d2df"
transcriber = aai.Transcriber()

# Set up LangChain with OpenAI
llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0,
    api_key=os.getenv("OPENAI_API_KEY")
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

• Differential Considerations:
  - Primary diagnoses:
    ∘ ICD-10 code with complete description (e.g., "I10 - Essential (primary) hypertension")
    ∘ Probability ranking (high/medium/low likelihood)
    ∘ Key clinical features supporting each diagnosis
    ∘ Specific diagnostic criteria met/unmet
  - Supporting evidence:
    ∘ Relevant physical exam findings
    ∘ Laboratory results correlation
    ∘ Imaging study interpretations
    ∘ Clinical scoring systems/algorithms used
  - Rule-out diagnoses:
    ∘ Critical conditions to exclude
    ∘ Red flag symptoms/signs
    ∘ Risk stratification factors
    ∘ Required testing to definitively rule out
  - Distinguishing characteristics:
    ∘ Unique presenting features
    ∘ Temporal relationships
    ∘ Response to therapeutic trials
    ∘ Disease-specific markers/tests
  - Clinical decision points:
    ∘ Key diagnostic uncertainties
    ∘ Required additional workup
    ∘ Consultation needs
    ∘ Monitoring parameters

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

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...), language: str = 'ar'):
    try:
        # Save the uploaded file temporarily
        with open("temp_audio.wav", "wb") as buffer:
            buffer.write(await file.read())
        
        # Transcribe the audio
        config = aai.TranscriptionConfig(language_code='ar', speech_model=aai.SpeechModel.nano)
        transcript = transcriber.transcribe("temp_audio.wav", config)

        # Generate SOAP note
        soap_note = llm.invoke(
            prompt.format(transcript=transcript.text)
        )

        # Clean up temporary file
        os.remove("temp_audio.wav")

        return {"soap_note": soap_note.content}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)