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
• Chief Complaint:
  - Primary concern with exact duration (days/weeks/months)
  - Pain scale rating (if applicable, 0-10)
  - Pattern and timing of symptoms
• History of Present Illness:
  - Chronological progression of symptoms
  - Specific associated symptoms
  - Precise aggravating and alleviating factors
  - Previous treatments attempted
• Past Medical History:
  - Chronic conditions
  - Previous surgeries with dates
  - Relevant hospitalizations
• Current Medications:
  - Name (generic and brand)
  - Exact dosage and frequency
  - Duration of current regimen
  - Compliance history
• Allergies:
  - Medication allergies with specific reactions
  - Environmental/food allergies
  - Severity of reactions
• Family History:
  - First-degree relatives' conditions
  - Age of onset for hereditary conditions
  - Current status of family members
• Social History:
  - Occupation and work environment
  - Living situation and support system
  - Detailed habits:
    ∘ Smoking (packs/day, years)
    ∘ Alcohol (type, frequency, amount)
    ∘ Exercise routine
    ∘ Diet patterns
• Review of Systems (positive/negative findings for):
  - Cardiovascular
  - Respiratory
  - Gastrointestinal
  - Musculoskeletal
  - Neurological
  - Other pertinent systems

## Objective
• Vital Signs (with units):
  - Blood pressure (mmHg)
  - Heart rate (bpm)
  - Temperature (°C/°F)
  - Respiratory rate (breaths/min)
  - O2 saturation (%)
  - BMI
• Physical Examination:
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
• Diagnostic Studies:
  - ECG findings
  - Imaging results
  - Other test results

## Assessment
• Primary Diagnosis:
  - Specific condition with ICD-10 code
  - Stage/severity classification
• Differential Diagnoses:
  - Listed by probability
  - System-Condition format
  - Supporting/opposing factors
• Clinical Reasoning:
  - Key findings supporting diagnosis
  - Risk stratification
  - Disease progression assessment
• Complications:
  - Current complications
  - Potential complications
  - Risk factors

## Plan
• Medications:
  - New prescriptions (name, dose, frequency, duration)
  - Modified medications
  - Discontinued medications
  - Reason for each change
• Diagnostic Testing:
  - Ordered tests with rationale
  - Expected timeframe
  - Specific instructions
• Interventions:
  - Procedures planned
  - Referrals with urgency level
  - Specialist consultations
• Patient Education:
  - Lifestyle modifications
  - Warning signs to monitor
  - Self-management instructions
• Follow-up:
  - Next appointment timing
  - Specific goals for next visit
  - Conditions for earlier return

---

### Critical Requirements:
1. Extract information ONLY from the provided transcript: {transcript}
2. Use standardized medical terminology and approved abbreviations
3. Document with extreme precision - avoid vague terms
4. Maintain strict chronological order in historical sections
5. Include exact measurements with appropriate units
6. Format using hierarchical bullet points for clarity
7. Emphasize cardiovascular findings and their clinical significance
8. Establish clear connections between symptoms and findings
9. Mark undocumented information as "Not reported in transcript"
10. Follow standard medical documentation guidelines
11. Include pertinent negatives when clinically relevant
12. Quantify findings whenever possible
13. Note any urgent/emergent conditions prominently
14. Document patient's understanding and compliance
15. Include time stamps for critical events/findings

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