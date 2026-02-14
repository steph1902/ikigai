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
    building_type: str  # Encoded as int or processed? Simulating raw input for now
    
class PredictionResponse(BaseModel):
    predicted_price: int
    confidence_interval: List[int]
    explanation: str

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
def predict_price(features: PropertyFeatures):
    try:
        if model:
            # Prepare input dataframe matching training schema
            # Exclude building_type as dummy model doesn't use it
            input_data = features.dict()
            input_data.pop("building_type", None)
            input_df = pd.DataFrame([input_data])
            prediction = model.predict(input_df)[0]
        else:
            # Dummy logic if no model trained yet
            base_price_per_sqm = 1000000 # 1 million yen per sqm
            prediction = features.total_area_sqm * base_price_per_sqm
            
        return PredictionResponse(
            predicted_price=int(prediction),
            confidence_interval=[int(prediction * 0.9), int(prediction * 1.1)],
            explanation="Based on size and location trends."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
