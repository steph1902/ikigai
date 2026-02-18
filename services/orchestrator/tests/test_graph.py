
import pytest
from src.graph import create_graph
from src.models.state import AgentState
from langchain_core.messages import HumanMessage, AIMessage

# Mock the subgraphs to avoid actual LLM calls during testing
# In a real scenario, we would mock the `create_mediation_subgraph` etc.

@pytest.mark.asyncio
async def test_graph_initialization():
    """Test that the graph compiles successfully"""
    graph = create_graph()
    assert graph is not None

@pytest.mark.asyncio
async def test_mediation_routing_handoff():
    """
    Test that the graph handles 'safety' violation simulation.
    Note: Without mocking the LLM, we can't easily deterministic test the runtime routing 
    unless we mock the invoked nodes.
    For this smoke test, we verify the graph structure.
    """
    graph = create_graph()
    
    # We can check if the nodes exist in the compiled graph
    # Accessing underlying graph structure depends on LangGraph version
    # fallback to just basic compilation check for now.
    assert "mediation_agent" in graph.get_graph().nodes
    assert "general_chat" in graph.get_graph().nodes

def test_state_schema():
    """Test AgentState schema instantiation"""
    state = AgentState(
        messages=[HumanMessage(content="Hello")],
        next_step="general_chat",
        is_safe=True
    )
    assert state['messages'][0].content == "Hello"
