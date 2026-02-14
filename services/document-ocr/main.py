import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from pypdf import PdfReader
from io import BytesIO
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI(title="IKIGAI Document Intelligence Service")

# Simple logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DocumentAnalysisResponse(BaseModel):
    filename: str
    text_content: str
    page_count: int
    status: str = "completed"

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/analyze", response_model=DocumentAnalysisResponse)
async def analyze_document(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file: {file.filename}")
        
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported currently.")

        content = await file.read()
        pdf_file = BytesIO(content)
        
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
            
        logger.info(f"Extracted {len(text)} characters from {len(reader.pages)} pages.")

        return DocumentAnalysisResponse(
            filename=file.filename,
            text_content=text,
            page_count=len(reader.pages)
        )

    except Exception as e:
        logger.error(f"Error processing document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
