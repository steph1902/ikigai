
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from src.models.state import AgentState
from src.subgraphs.search import create_search_subgraph
from src.subgraphs.viewing import create_viewing_subgraph
from src.subgraphs.transaction import create_transaction_subgraph
from src.subgraphs.document import create_document_subgraph
from langchain_core.messages import AIMessage, HumanMessage

def intent_classifier(state: AgentState):
    """
    Routes the user to the correct subgraph based on intent.
    Ideal: Use an LLM + JSON mode.
    MVP: Keyword matching.
    """
    if not state['messages']:
        return {"next_step": "general_chat"}
        
    last_msg = state['messages'][-1].content.lower()
    
    if "search" in last_msg or "find" in last_msg or "buy" in last_msg or "apartment" in last_msg:
        return {"next_step": "search"}
    elif "view" in last_msg or "book" in last_msg or "see" in last_msg:
        return {"next_step": "viewing"}
    elif "offer" in last_msg or "contract" in last_msg:
        return {"next_step": "transaction"}
    elif "analyze" in last_msg or "document" in last_msg or "pdf" in last_msg:
        return {"next_step": "document"}
    else:
        return {"next_step": "general_chat"}

def general_chat(state: AgentState):
    """Basic fallback chat."""
    return {"messages": [AIMessage(content="I can help you search for properties, book viewings, or analyze real estate documents. What would you like to do?")]}

def create_graph():
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("router", intent_classifier)
    workflow.add_node("general_chat", general_chat)
    
    # Add Subgraphs as compiled graphs
    try:
        workflow.add_node("search_agent", create_search_subgraph())
        workflow.add_node("viewing_agent", create_viewing_subgraph())
        workflow.add_node("transaction_agent", create_transaction_subgraph())
        workflow.add_node("document_agent", create_document_subgraph()) 
    except Exception as e:
        print(f"Error creating subgraphs: {e}")
        raise e

    # Edges
    workflow.set_entry_point("router")
    
    def route_logic(state: AgentState):
        step = state.get('next_step')
        if step == 'search': return "search_agent"
        if step == 'viewing': return "viewing_agent"
        if step == 'transaction': return "transaction_agent"
        if step == 'document': return "document_agent"
        return "general_chat"

    workflow.add_conditional_edges(
        "router",
        route_logic,
        {
            "search_agent": "search_agent",
            "viewing_agent": "viewing_agent",
            "transaction_agent": "transaction_agent",
            "document_agent": "document_agent",
            "general_chat": "general_chat"
        }
    )

    workflow.add_edge("general_chat", END)
    workflow.add_edge("search_agent", END)
    workflow.add_edge("viewing_agent", END)
    workflow.add_edge("transaction_agent", END)
    workflow.add_edge("document_agent", END)

    return workflow.compile()

# Validates that the graph compiles correctly
if __name__ == "__main__":
    try:
        graph = create_graph()
        print("✅ Graph compiled successfully.")
    except Exception as e:
        print(f"❌ Graph compilation failed: {e}")
