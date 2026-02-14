import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import cohere
import numpy as np
from typing import List, Optional

app = FastAPI(title="IKIGAI Embedding Service")

class EmbedRequest(BaseModel):
    texts: List[str]
    model: str = "embed-multilingual-v3.0"
    input_type: str = "search_document"

class EmbedResponse(BaseModel):
    embeddings: List[List[float]]

# Initialize Cohere client if API key is present
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.Client(COHERE_API_KEY) if COHERE_API_KEY else None

@app.get("/health")
def health_check():
    return {"status": "ok", "provider": "cohere" if co else "mock"}

@app.post("/embed", response_model=EmbedResponse)
async def embed_texts(request: EmbedRequest):
    try:
        if co:
            response = co.embed(
                texts=request.texts,
                model=request.model,
                input_type=request.input_type
            )
            return EmbedResponse(embeddings=response.embeddings)
        else:
            # Fallback mock embedding for dev/testing without API key
            # Returns random 1024-dim vectors
            print("Warning: Using mock embeddings (COHERE_API_KEY not found)")
            mock_embeddings = [np.random.rand(1024).tolist() for _ in request.texts]
            return EmbedResponse(embeddings=mock_embeddings)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
