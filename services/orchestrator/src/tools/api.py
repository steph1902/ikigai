
import os
from typing import Optional, Dict, Any, List
from src.utils.service_client import call_service, PRICING_SERVICE_URL, DOCUMENT_SERVICE_URL, VR_SERVICE_URL

# --- Pricing Tools ---

async def predict_price(
    city_code: int,
    district_code: int,
    total_floor_area: float,
    building_year: int,
    floor_plan: str,
    renovation: int = 0
) -> Dict[str, Any]:
    """
    Predicts the property price based on features using the Pricing Service.
    """
    payload = {
        "CityCode": city_code,
        "DistrictCode": district_code,
        "TotalFloorArea": total_floor_area,
        "BuildingYear": building_year,
        "FloorPlan": floor_plan,
        "Renovation": renovation
    }
    
    try:
        return await call_service(PRICING_SERVICE_URL, "/predict", method="POST", data=payload)
    except Exception as e:
        return {"error": f"Pricing service failed: {str(e)}"}

# --- OCR Tools ---

async def analyze_document(file_url: str) -> Dict[str, Any]:
    """
    Extracts text and structured data from a document PDF/Image using the OCR Service.
    """
    payload = {"file_url": file_url}

    try:
        return await call_service(DOCUMENT_SERVICE_URL, "/analyze", method="POST", data=payload)
    except Exception as e:
         return {"error": f"OCR service failed: {str(e)}"}

# --- VR Tools ---

async def generate_vr_tour(floor_plan_image_url: str) -> Dict[str, Any]:
    """
    Generates a 3D VR tour from a 2D floor plan image using the VR Engine.
    """
    payload = {"image_url": floor_plan_image_url}

    try:
        return await call_service(VR_SERVICE_URL, "/generate", method="POST", data=payload)
    except Exception as e:
        return {"error": f"VR engine failed: {str(e)}"}
