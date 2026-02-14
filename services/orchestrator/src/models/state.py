
from typing import TypedDict, Annotated, List, Union, Dict, Any, Optional
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage

# Define the state for the main graph
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    user_id: str
    thread_id: str
    
    # User Context
    user_preferences: Optional[Dict[str, Any]] # e.g., {'budget': 50000000, 'areas': ['Shibuya']}
    
    # Active Subgraph Context
    next_step: Optional[str] # 'search', 'viewing', 'transaction', 'document'
    
    # Shared Data across subgraphs (optional, keys can be specific)
    current_property_id: Optional[str]
    search_filters: Optional[Dict[str, Any]]
    
