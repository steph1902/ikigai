from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random

app = FastAPI(title="IKIGAI VR Engine")

class FloorPlanRequest(BaseModel):
    image_url: str
    property_id: str

class ModelResponse(BaseModel):
    model_url: str
    format: str = "gltf"
    status: str = "completed"

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/generate", response_model=ModelResponse)
def generate_3d_model(request: FloorPlanRequest):
    # In a real implementation, this would:
    # 1. Download floor plan image
    # 2. Run CV to detect walls/windows/doors
    # 3. Use trimesh to extrude geometry
    # 4. Export GLTF and upload to S3
    
    # For MVP, we return a mock URL pointing to a public sample or S3 placeholder
    mock_models = [
        "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf",
        "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Triangle/glTF/Triangle.gltf"
    ]
    
    return ModelResponse(
        model_url=random.choice(mock_models),
        status="completed"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
