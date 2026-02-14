
from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_core.messages import AIMessage
from src.models.state import AgentState

# For simplicity, sharing the same state type for now, but could be specialized
class ViewingState(AgentState):
    pass

def check_availability(state: ViewingState):
    """
    Checks if the requested property has viewing slots.
    """
    # Mock logic
    property_id = state.get('current_property_id')
    print(f"Checking slots for {property_id}...")
    
    available_slots = ["Tomorrow 10:00 AM", "Tomorrow 2:00 PM", "Saturday 11:00 AM"]
    return {"available_slots": available_slots} # Needs to be in State schema ideally

def book_slot_interaction(state: ViewingState):
    """
    Asks the user to pick a slot.
    """
    slots = state.get('available_slots', []) # Hacky state access for MVP
    slots_text = ", ".join(slots)
    return {"messages": [AIMessage(content=f"I have the following slots available: {slots_text}. Which one works for you?")]}

def create_viewing_subgraph():
    workflow = StateGraph(ViewingState)
    
    workflow.add_node("check_availability", check_availability)
    workflow.add_node("ask_user", book_slot_interaction)
    
    workflow.set_entry_point("check_availability")
    workflow.add_edge("check_availability", "ask_user")
    workflow.add_edge("ask_user", END)
    
    return workflow.compile()
