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
# SOAP Note Template

Please format your response using the following markdown structure:

## Subjective
[Patient's history, symptoms, and complaints]

## Objective 
[Physical examination findings and test results]

## Assessment
[Clinical analysis and differential diagnoses]

## Plan
[Treatment recommendations and follow-up]

## Conclusion
[Summary of key findings and plan]

## Differential Diagnosis
[Primary condition in System-Condition format]

---

### Notes for Response Generation:
- Convert the following transcript into the above format: {transcript}
- Maintain professional medical terminology
- Focus on cardiovascular findings
- Include only information present in the transcript
- Structure all content using markdown headers and bullet points
- Use proper medical documentation standards
- Ensure all sections are complete and accurate
"""

prompt = PromptTemplate(
    input_variables=["transcript"],
    template=soap_template
)

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...), language: str = None):
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
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)