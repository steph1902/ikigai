import os
import math
import hashlib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="IKIGAI Embedding Service")

# Optional imports — may not be available in test environments
try:
    import cohere
    import numpy as np
    HAS_COHERE = True
except ImportError:
    cohere = None  # type: ignore
    np = None  # type: ignore
    HAS_COHERE = False

class EmbedRequest(BaseModel):
    texts: List[str]
    model: str = "embed-multilingual-v3.0"
    input_type: str = "search_document"

class EmbedResponse(BaseModel):
    embeddings: List[List[float]]

# Initialize Cohere client if API key is present
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.Client(COHERE_API_KEY) if (HAS_COHERE and COHERE_API_KEY) else None


def generate_mock_embedding(text: str, dim: int = 1024) -> List[float]:
    """
    Generate a deterministic mock embedding from text using hashlib.
    No external dependencies required.

    The embedding is normalized to approximately unit length.
    """
    # Create a deterministic seed from the text
    seed = int(hashlib.sha256(text.encode("utf-8")).hexdigest(), 16)

    # Generate deterministic pseudo-random values
    embedding = []
    for i in range(dim):
        # Use a simple LCG-like approach seeded by text hash + position
        val = ((seed * (i + 1) + 12345) % 2147483647) / 2147483647
        embedding.append(val - 0.5)  # Center around 0

    # Normalize to unit length
    magnitude = math.sqrt(sum(x * x for x in embedding))
    if magnitude > 0:
        embedding = [x / magnitude for x in embedding]

    return embedding


@app.get("/health")
def health_check():
    return {"status": "ok", "provider": "cohere" if co else "mock"}

@app.post("/embed", response_model=EmbedResponse)
async def embed_texts(request: EmbedRequest):
    try:
        if co and np is not None:
            response = co.embed(
                texts=request.texts,
                model=request.model,
                input_type=request.input_type
            )
            return EmbedResponse(embeddings=response.embeddings)
        else:
            # Fallback: deterministic mock embeddings
            mock_embeddings = [generate_mock_embedding(t) for t in request.texts]
            return EmbedResponse(embeddings=mock_embeddings)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

