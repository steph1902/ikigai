
from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_core.messages import AIMessage
from src.models.state import AgentState

class TransactionState(AgentState):
    offer_amount: int
    contract_status: str

def generate_offer(state: TransactionState):
    """
    Drafts an offer based on user intent.
    """
    amount = 50000000 # Mock extraction
    return {"offer_amount": amount, "contract_status": "draft"}

def validate_contract(state: TransactionState):
    """
    Simulates contract validation logic.
    """
    return {"contract_status": "validated"}

def notify_agent(state: TransactionState):
    """
    Notifies a human agent (or simulates it).
    """
    return {"messages": [AIMessage(content="I've drafted the offer letter for you. A human agent will review it shortly.")]}

def create_transaction_subgraph():
    workflow = StateGraph(TransactionState)
    
    workflow.add_node("draft", generate_offer)
    workflow.add_node("validate", validate_contract)
    workflow.add_node("notify", notify_agent)
    
    workflow.set_entry_point("draft")
    workflow.add_edge("draft", "validate")
    workflow.add_edge("validate", "notify")
    workflow.add_edge("notify", END)
    
    return workflow.compile()
