
import httpx
import os
from typing import Optional, Dict, Any, List

# Environment variables for service URLs
PRICING_SERVICE_URL = os.getenv("PRICING_SERVICE_URL", "http://pricing-model:8002")
OCR_SERVICE_URL = os.getenv("OCR_SERVICE_URL", "http://document-ocr:8003")
VR_SERVICE_URL = os.getenv("VR_SERVICE_URL", "http://vr-engine:8004")


# Global registry for tools (if needed, or just import functions directly)
function_registry = {}

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
    url = f"{PRICING_SERVICE_URL}/predict"
    payload = {
        "CityCode": city_code,
        "DistrictCode": district_code,
        "TotalFloorArea": total_floor_area,
        "BuildingYear": building_year,
        "FloorPlan": floor_plan,
        "Renovation": renovation
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=5.0)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            return {"error": f"Pricing service failed: {str(e)}"}

# --- OCR Tools ---

async def analyze_document(file_url: str) -> Dict[str, Any]:
    """
    Extracts text and structured data from a document PDF/Image using the OCR Service.
    """
    url = f"{OCR_SERVICE_URL}/analyze"
    payload = {"file_url": file_url}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
             return {"error": f"OCR service failed: {str(e)}"}

# --- VR Tools ---

async def generate_vr_tour(floor_plan_image_url: str) -> Dict[str, Any]:
    """
    Generates a 3D VR tour from a 2D floor plan image using the VR Engine.
    """
    url = f"{VR_SERVICE_URL}/generate"
    payload = {"image_url": floor_plan_image_url}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=60.0) # Generation can be slow
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            return {"error": f"VR engine failed: {str(e)}"}
