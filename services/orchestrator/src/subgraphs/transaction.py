from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_core.messages import AIMessage
from src.models.state import AgentState
from src.tools.pdf_generator import PDFGenerator
from src.utils.db import log_action

class TransactionState(AgentState):
    offer_amount: int
    contract_status: str
    property_id: str
    mortgage_amount: int

pdf_gen = PDFGenerator()

def generate_offer(state: TransactionState):
    """
    Drafts an offer based on user intent and generates a PDF.
    Logs the action for regulatory compliance.
    """
    # In a real app, extraction would be robust. Using mock/default for demo.
    amount = state.get("offer_amount", 80000000)
    property_id = state.get("property_id", "PROP-1234")
    user_name = "Demo User" # Should come from state user profile
    user_id = state.get("user_id", "demo-user-id")
    
    pdf_path = pdf_gen.generate_purchase_offer(property_id, amount, user_name)
    
    log_action(
        user_id=user_id,
        action_name="GENERATE_OFFER",
        inputs={"property_id": property_id, "amount": amount},
        outputs={"pdf_path": pdf_path},
        permission="user_approval"
    )
    
    return {
        "messages": [AIMessage(content=f"I have drafted the Purchase Offer (買付証明書) for property {property_id} at JPY {amount:,}. You can review it here: {pdf_path}")],
        "contract_status": "draft_offer_generated"
    }

def submit_mortgage(state: TransactionState):
    """
    Simulates mortgage application submission and generates a PDF.
    Logs the action for regulatory compliance.
    """
    amount = state.get("mortgage_amount", 60000000)
    user_data = {"name": "Demo User", "income": 12000000, "employment": "Full-time"} # Mock
    user_id = state.get("user_id", "demo-user-id")
    
    pdf_path = pdf_gen.generate_mortgage_application(user_data, amount)
    
    log_action(
        user_id=user_id,
        action_name="SUBMIT_MORTGAGE_PREAPPROVAL",
        inputs={"amount": amount, "financial_profile": "encrypted"},
        outputs={"pdf_path": pdf_path, "application_id": "MOCK-APP-001"},
        permission="user_approval"
    )
    
    return {
        "messages": [AIMessage(content=f"I have prepared your Mortgage Pre-approval Application for JPY {amount:,}. The official PDF record is here: {pdf_path}. Application ID: MOCK-APP-001.")],
        "contract_status": "mortgage_submitted"
    }

def request_registration(state: TransactionState):
    """
    Simulates Judicial Scrivener request for title registration.
    """
    property_id = state.get("property_id", "PROP-1234")
    user_name = "Demo User"
    user_id = state.get("user_id", "demo-user-id")
    
    # Generate PDF
    pdf_path = pdf_gen.generate_scrivener_request(property_id, user_name)
    
    log_action(
        user_id=user_id,
        action_name="REQUEST_TITLE_REGISTRATION",
        inputs={"property_id": property_id},
        outputs={"pdf_path": pdf_path, "status": "sent_to_scrivener"},
        permission="autonomous"  # Or user_approval if critical
    )
    
    return {
        "messages": [AIMessage(content=f"I have formally requested the Judicial Scrivener (司法書士) to register the title transfer. Use this Request ID for tracking: {pdf_path}")],
        "contract_status": "registration_requested"
    }

def router(state: TransactionState):
    """Routes based on message content."""
    messages = state.get("messages", [])
    if not messages:
        return "generate_offer"
        
    last_msg = messages[-1].content.lower()
    
    if "mortgage" in last_msg or "loan" in last_msg:
        return "submit_mortgage"
    elif "register" in last_msg or "title" in last_msg or "scrivener" in last_msg:
        return "request_registration"
    else:
        return "generate_offer"

def create_transaction_subgraph():
    workflow = StateGraph(TransactionState)
    
    workflow.add_node("entry_router", lambda x: x) # Dummy node or just use conditional entry
    workflow.add_node("generate_offer", generate_offer)
    workflow.add_node("submit_mortgage", submit_mortgage)
    workflow.add_node("request_registration", request_registration)
    
    # Conditional Entry Point
    workflow.set_conditional_entry_point(
        router,
        {
            "generate_offer": "generate_offer",
            "submit_mortgage": "submit_mortgage",
            "request_registration": "request_registration"
        }
    )
    
    workflow.add_edge("generate_offer", END)
    workflow.add_edge("submit_mortgage", END)
    workflow.add_edge("request_registration", END)
    
    return workflow.compile()
