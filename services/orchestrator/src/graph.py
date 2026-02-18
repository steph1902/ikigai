
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langchain_core.messages import AIMessage
from src.models.state import AgentState
from src.subgraphs.search import create_search_subgraph
from src.subgraphs.viewing import create_viewing_subgraph
from src.subgraphs.transaction import create_transaction_subgraph
from src.subgraphs.document import create_document_subgraph
from src.subgraphs.renovation import renovation_app
from src.subgraphs.mediation import create_mediation_subgraph

def general_chat(state: AgentState):
    """Basic fallback chat."""
    return {"messages": [AIMessage(content="I can help you search for properties, book viewings, analyze documents, or estimate renovation costs. What would you like to do?")]}

def create_graph():
    workflow = StateGraph(AgentState)
    
    # Add nodes
    # The mediation agent replaces the router and handles safety checks (Category A/B/C)
    workflow.add_node("mediation_agent", create_mediation_subgraph())
    workflow.add_node("general_chat", general_chat)
    
    # Add Subgraphs as compiled graphs
    try:
        workflow.add_node("search_agent", create_search_subgraph())
        workflow.add_node("viewing_agent", create_viewing_subgraph())
        workflow.add_node("transaction_agent", create_transaction_subgraph())
        workflow.add_node("document_agent", create_document_subgraph()) 
        workflow.add_node("renovation_agent", renovation_app)
    except Exception as e:
        print(f"Error creating subgraphs: {e}")
        raise e

    # Edges
    workflow.set_entry_point("mediation_agent")
    
    def route_logic(state: AgentState):
        step = state.get('next_step')
        if step == 'handoff': return END # Mediation handled the response
        if step == 'search': return "search_agent"
        if step == 'viewing': return "viewing_agent"
        if step == 'transaction': return "transaction_agent"
        if step == 'document': return "document_agent"
        if step == 'renovation': return "renovation_agent"
        return "general_chat"

    workflow.add_conditional_edges(
        "mediation_agent",
        route_logic,
        {
            "search_agent": "search_agent",
            "viewing_agent": "viewing_agent",
            "transaction_agent": "transaction_agent",
            "document_agent": "document_agent",
            "renovation_agent": "renovation_agent",
            "general_chat": "general_chat",
            END: END
        }
    )

    workflow.add_edge("general_chat", END)
    workflow.add_edge("search_agent", END)
    workflow.add_edge("viewing_agent", END)
    workflow.add_edge("transaction_agent", END)
    workflow.add_edge("document_agent", END)
    workflow.add_edge("renovation_agent", END)

    return workflow.compile()

# Validates that the graph compiles correctly
if __name__ == "__main__":
    try:
        graph = create_graph()
        print("✅ Graph compiled successfully.")
    except Exception as e:
        print(f"❌ Graph compilation failed: {e}")
