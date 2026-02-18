import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="IKIGAI Pricing Model Service")

# Model path
MODEL_PATH = "model.joblib"
model = None

# Load model on startup
@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("Model loaded successfully")
    else:
        print("Model not found, using dummy predictor")

class PropertyFeatures(BaseModel):
    total_area_sqm: float
    year_built: int
    minutes_to_station: int
    latitude: float
    longitude: float
    building_type: str  
    region: str = "tokyo" # tokyo, osaka, nagoya
    
class PredictionResponse(BaseModel):
    predicted_price: int
    confidence_interval: List[int]
    explanation: str

# Constants
REGION_MULTIPLIERS = {
    "tokyo": 1.0,
    "osaka": 0.75,
    "nagoya": 0.6
}

QUALITY_MULTIPLIERS = {
    "standard": 1.0,
    "high_end": 1.6
}

RENOVATION_COSTS = {
    "wallpaper": 1500, # per sqm per wall surface
    "flooring": 8000, # per sqm
    "kitchen": 800000, # fixed unit cost
    "bath": 1000000, # fixed unit cost
    "toilet": 200000, # fixed unit cost
    "full": 150000 # per sqm for full renovation
}

BASE_PRICE_PER_SQM_TOKYO = 1000000

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
def predict_price(features: PropertyFeatures):
    try:
        multiplier = REGION_MULTIPLIERS.get(features.region.lower(), 1.0)
        
        if model:
            # Prepare input dataframe matching training schema
            input_data = features.dict()
            input_data.pop("building_type", None)
            input_data.pop("region", None)
            input_df = pd.DataFrame([input_data])
            prediction = model.predict(input_df)[0]
            # Apply regional adjustment to model output if model determines base price (simplified)
            prediction = prediction * multiplier
        else:
            # Dummy logic if no model trained yet
            prediction = features.total_area_sqm * BASE_PRICE_PER_SQM_TOKYO * multiplier
            
        return PredictionResponse(
            predicted_price=int(prediction),
            confidence_interval=[int(prediction * 0.9), int(prediction * 1.1)],
            explanation=f"Based on size and location trends for {features.region.title()}."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RenovationRequest(BaseModel):
    total_area_sqm: float
    scope: str # full, kitchen, bath, wallpaper, flooring
    quality: str # standard, high_end
    region: str = "tokyo" # tokyo, osaka, nagoya

class RenovationResponse(BaseModel):
    estimated_cost: int
    breakdown: dict
    duration_weeks: int

@app.post("/renovate", response_model=RenovationResponse)
def estimate_renovation(request: RenovationRequest):
    # Base costs per unit (JPY)
    # These are rough market averages
    costs = RENOVATION_COSTS
    
    multiplier = REGION_MULTIPLIERS.get(request.region.lower(), 1.0) * QUALITY_MULTIPLIERS.get(request.quality.lower(), 1.0)
    
    total_cost = 0
    breakdown = {}
    duration = 2
    
    if request.scope == "full":
        base = costs["full"] * request.total_area_sqm
        total_cost = base * multiplier
        breakdown["construction"] = int(total_cost * 0.7)
        breakdown["materials"] = int(total_cost * 0.3)
        duration = 8
    elif request.scope == "kitchen":
        total_cost = costs["kitchen"] * multiplier
        breakdown["unit_price"] = int(total_cost)
        duration = 1
    elif request.scope == "bath":
        total_cost = costs["bath"] * multiplier
        breakdown["unit_price"] = int(total_cost)
        duration = 2
    else:
        # Wallpaper/Flooring mixed logic
        base = 0
        if "wallpaper" in request.scope:
            base += costs["wallpaper"] * request.total_area_sqm * 3 # approx wall area
        if "flooring" in request.scope:
            base += costs["flooring"] * request.total_area_sqm
        total_cost = base * multiplier
        breakdown["materials"] = int(total_cost * 0.4)
        breakdown["labor"] = int(total_cost * 0.6)
        
    return RenovationResponse(
        estimated_cost=int(total_cost),
        breakdown=breakdown,
        duration_weeks=duration
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
