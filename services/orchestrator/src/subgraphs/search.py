
from typing import TypedDict, Annotated, List, Dict, Any
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from src.models.state import AgentState
from src.tools.api import predict_price

# Subgraph State (extends main state or uses specific keys)
class SearchState(AgentState):
    start_node: str # Entry point

# --- Nodes ---

def query_analysis(state: SearchState):
    """
    Analyzes the user's latest message to extract search filters.
    Ideally uses an LLM call here to extract JSON.
    For MVP, we'll do simple keyword extraction or mock it.
    """
    last_message = state['messages'][-1].content
    print(f"Analyzing query: {last_message}")
    
    # Mock extraction for MVP
    filters = {}
    if "Shibuya" in last_message:
        filters['ward'] = 'Shibuya'
    if "Minato" in last_message:
        filters['ward'] = 'Minato'
        
    return {"search_filters": filters}

def search_execution(state: SearchState):
    """
    Executes the search against the database using the extracted filters.
    """
    filters = state.get('search_filters', {})
    print(f"Executing search with filters: {filters}")
    
    # Mock DB results for now (since we don't have direct DB access in this file yet, 
    # normally we'd call a tool or service).
    # In a real impl, this would query the 'properties' table via a tool.
    
    results = [
        {"id": "prop_1", "title": "Luxury Condo in Shibuya", "price": 85000000},
        {"id": "prop_2", "title": "Cozy Apartment near Station", "price": 45000000}
    ]
    
    # If filters match, return filtered (mock logic)
    if filters.get('ward') == 'Minato':
         results = [{"id": "prop_3", "title": "Minato Residence", "price": 120000000}]
         
    return {"search_results": results} # We need to add this key to State if we want to persit it

def response_generation(state: SearchState):
    """
    Generates a natural language response based on search results.
    """
    results = state.get('search_results', []) # Need to ensure this flows through
    
    if not results:
        response = "I couldn't find any properties matching your criteria. Could you try broadening your search?"
    else:
        # Simple formatting
        bullet_points = "\n".join([f"- {r['title']} (¥{r['price']:,})" for r in results])
        response = f"I found {len(results)} properties for you:\n{bullet_points}\n\nWould you like to see details or book a viewing for any of these?"
        
    return {"messages": [AIMessage(content=response)]}

# --- Graph Definition ---

def create_search_subgraph():
    workflow = StateGraph(SearchState)
    
    workflow.add_node("analyze", query_analysis)
    workflow.add_node("search", search_execution)
    workflow.add_node("respond", response_generation)
    
    workflow.set_entry_point("analyze")
    
    workflow.add_edge("analyze", "search")
    workflow.add_edge("search", "respond")
    workflow.add_edge("respond", END)
    
    return workflow.compile()
