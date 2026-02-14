import os
from typing import List, Optional
from langchain_core.tools import tool
from src.utils.service_client import call_service, PRICING_SERVICE_URL

@tool
async def predict_property_price(
    total_area_sqm: float,
    year_built: int,
    minutes_to_station: int,
    latitude: float,
    longitude: float
) -> str:
    """
    Predict the market price of a property based on its features using the AI Pricing Model.
    Use this to help users estimate if a property is over/underpriced.
    """
    try:
        response = await call_service(
            PRICING_SERVICE_URL,
            "/predict",
            method="POST",
            data={
                "total_area_sqm": total_area_sqm,
                "year_built": year_built,
                "minutes_to_station": minutes_to_station,
                "latitude": latitude,
                "longitude": longitude
                # building_type omitted as per current dummy model
            }
        )
        return f"Predicted Price: {response['predicted_price']} JPY\n" \
               f"Confidence Interval: {response['confidence_interval']}\n" \
               f"Explanation: {response['explanation']}"
    except Exception as e:
        return f"Error calling pricing service: {str(e)}"
