from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage
from .transaction import TransactionState # Reuse state or define new one
from ..tools.pdf_generator import PDFGenerator
from ..utils.db import log_action
import requests
import json

# We can reuse TransactionState or extend it. 
# For simplicity, let's assume we use the same AgentState structure.

class RenovationState(TypedDict):
    messages: Annotated[List[dict], "messages"]
    property_id: str
    renovation_scope: str # "full", "kitchen", etc.
    renovation_quality: str # "standard", "high_end"
    estimated_cost: int
    user_id: str

pdf_gen = PDFGenerator()
PRICING_SERVICE_URL = "http://pricing-model:8002/renovate"

def determine_scope(state: RenovationState):
    """Analyze chat history to determine scope and quality."""
    messages = state["messages"]
    last_msg = messages[-1].content.lower()
    
    scope = "full"
    if "kitchen" in last_msg:
        scope = "kitchen"
    elif "bath" in last_msg:
        scope = "bath"
    elif "wallpaper" in last_msg or "floor" in last_msg:
        scope = "wallpaper+flooring"
        
    quality = "standard"
    if "luxury" in last_msg or "high end" in last_msg or "best" in last_msg:
        quality = "high_end"
        
    return {
        "renovation_scope": scope,
        "renovation_quality": quality
    }

def get_renovation_quote(state: RenovationState):
    """Call Pricing Service to get quote."""
    # Mock property size for now or extract from state
    # In a real app, property_id would fetch actual sqm.
    # We will assume a standard 65sqm 2LDK for Simulation
    area_sqm = 65.0 
    
    payload = {
        "total_area_sqm": area_sqm,
        "scope": state["renovation_scope"],
        "quality": state["renovation_quality"],
        "region": "tokyo"
    }
    
    try:
        # Check if running in Docker network or localhost (handling both for dev safety)
        # Using service name 'pricing-model' assumes Docker DNS
        response = requests.post(PRICING_SERVICE_URL, json=payload, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        return {
            "estimated_cost": data["estimated_cost"],
            "breakdown": data["breakdown"],
            "duration_weeks": data["duration_weeks"]
        }
    except Exception as e:
        print(f"Error fetching quote: {e}")
        # Fallback for dev/localhost if docker network fails
        return {
            "estimated_cost": 5000000, 
            "breakdown": {"construction": 3500000, "materials": 1500000},
            "duration_weeks": 6
        }

def generate_quote_pdf(state: RenovationState):
    """Generate PDF and log action."""
    # Extract data (merged from previous steps)
    quote_data = get_renovation_quote(state)
    
    pdf_path = pdf_gen.generate_renovation_quote(
        property_id=state.get("property_id", "PROP-001"),
        breakdown=quote_data["breakdown"],
        total_cost=quote_data["estimated_cost"],
        duration_weeks=quote_data["duration_weeks"]
    )
    
    log_action(
        user_id="user_123", # Mock user
        action_name="GENERATE_RENOVATION_QUOTE",
        inputs={
            "scope": state["renovation_scope"],
            "quality": state["renovation_quality"]
        },
        outputs={"pdf_path": pdf_path, "cost": quote_data["estimated_cost"]},
        permission="autonomous"
    )
    
    msg = f"""I have calculated a renovation estimate for a {state['renovation_quality']} Grade {state['renovation_scope']} renovation.
    
    **Estimated Cost**: JPY {quote_data['estimated_cost']:,}
    **Duration**: {quote_data['duration_weeks']} weeks
    
    You can download the detailed quote here: {pdf_path}
    """
    
    return {"messages": [AIMessage(content=msg)]}

# Build Graph
workflow = StateGraph(RenovationState)
workflow.add_node("determine_scope", determine_scope)
workflow.add_node("generate_quote", generate_quote_pdf)

workflow.set_entry_point("determine_scope")
workflow.add_edge("determine_scope", "generate_quote")
workflow.add_edge("generate_quote", END)

renovation_app = workflow.compile()
