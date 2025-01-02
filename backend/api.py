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
    model="gpt-4o-mini",
    temperature=0.2,
    api_key=os.getenv("OPENAI_API_KEY")
)

# SOAP note template
soap_template = """
You are an experienced cardiologist. Convert the following conversation transcript into a detailed SOAP note.
Focus on cardiovascular findings and maintain professional medical terminology.

Conversation Transcript:
{transcript}

Generate a comprehensive SOAP note using the following format:

==============================================
                SOAP NOTE
==============================================
Date: [Current Date]
Provider: Dr. [Name]
==============================================

SUBJECTIVE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Chief Complaint:
  ▢ Primary concern
  ▢ Duration and severity

• History of Present Illness:
  ▢ Onset and progression
  ▢ Associated symptoms
  ▢ Aggravating/alleviating factors

• Past Medical History:
  ▢ Relevant conditions
  ▢ Previous treatments
  ▢ Surgical history

• Current Medications:
  ▢ Name, dosage, frequency
  ▢ Compliance status
  ▢ Recent changes

• Allergies:
  ▢ Medication allergies
  ▢ Environmental allergies
  ▢ Reactions

• Family History:
  ▢ Relevant conditions
  ▢ Age of onset
  ▢ Current status

• Social History:
  ▢ Occupation
  ▢ Living situation
  ▢ Habits (smoking, alcohol, exercise)

• Review of Systems:
  ▢ Cardiovascular
  ▢ Respiratory
  ▢ Other pertinent systems

OBJECTIVE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Vital Signs:
  ▢ Blood pressure: [Value]
  ▢ Heart rate: [Value]
  ▢ Respiratory rate: [Value]
  ▢ Temperature: [Value]
  ▢ O2 saturation: [Value]

• Physical Examination:
  ▢ General appearance
  ▢ Cardiovascular exam
  ▢ Respiratory exam
  ▢ Other relevant findings

• Laboratory Results:
  ▢ Recent tests
  ▢ Significant values
  ▢ Pending results

ASSESSMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Primary Diagnosis:
  ▢ Condition
  ▢ Severity
  ▢ Stability

• Secondary Diagnoses:
  ▢ Related conditions
  ▢ Complications
  ▢ Risk factors

• Clinical Reasoning:
  ▢ Supporting evidence
  ▢ Differential diagnoses
  ▢ Risk assessment

PLAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Medications:
  ▢ New prescriptions
  ▢ Modifications
  ▢ Discontinued medications

• Treatment Plan:
  ▢ Interventions
  ▢ Referrals
  ▢ Lifestyle modifications

• Patient Education:
  ▢ Instructions provided
  ▢ Warning signs reviewed
  ▢ Follow-up care explained

• Follow-up:
  ▢ Next appointment
  ▢ Monitoring parameters
  ▢ Emergency instructions

==============================================
            Additional Notes
==============================================
• Critical Observations:
  ▢ Key findings
  ▢ Areas of concern
  ▢ Required attention

Please extract and organize all relevant clinical information from the conversation into this structured format.
If certain information is not mentioned in the transcript, mark it as 'Not reported' or 'Not assessed'.
"""

prompt = PromptTemplate(
    input_variables=["transcript"],
    template=soap_template
)

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # Save the uploaded file temporarily
        with open("temp_audio.wav", "wb") as buffer:
            buffer.write(await file.read())
        
        # Transcribe the audio
        config = aai.TranscriptionConfig(language_code="ar", speech_model=aai.SpeechModel.nano)
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
