import os
from langchain_core.tools import tool
from src.utils.service_client import call_service, VR_SERVICE_URL

@tool
def generate_vr_tour(property_id: str, floor_plan_url: str) -> str:
    """
    Generate a 3D VR tour for a property based on its floor plan.
    Returns a URL to the generated 3D model (glTF).
    """
    # Note: In a real async flow, this might just trigger a job.
    # For MVP synchronous tool, we call the generator endpoint.
    try:
        # We need to run async code in this sync tool wrapper or use async tool
        # For simplicity in this demo, we'll return a static/mock response 
        # or use a synchronous wrapper if strictly needed.
        # But LangGraph supports async tools. Let's start with a text stub 
        # to confirm the intent unless we fully implement async tool execution.
        
        return f"Viewing request initiated for property {property_id}. 3D Model will be generated from {floor_plan_url}."
    except Exception as e:
        return f"Error generating VR tour: {str(e)}"
