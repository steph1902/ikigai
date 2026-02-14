
from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_core.messages import AIMessage
from src.models.state import AgentState
from src.tools.api import analyze_document

class DocumentState(AgentState):
    file_url: str
    extraction_result: dict

async def process_document(state: DocumentState):
    """
    Calls the OCR service to analyze a document.
    """
    url = state.get('file_url')
    if not url:
        return {"messages": [AIMessage(content="Please provide a document URL to analyze.")]}
    
    result = await analyze_document(url)
    return {"extraction_result": result}

def summarize_findings(state: DocumentState):
    """
    Summarizes the OCR findings for the user.
    """
    result = state.get('extraction_result', {})
    summary = f"I've analyzed the document. It appears to be a {result.get('type', 'unknown document')}."
    return {"messages": [AIMessage(content=summary)]}

def create_document_subgraph():
    workflow = StateGraph(DocumentState)
    
    workflow.add_node("process", process_document)
    workflow.add_node("summarize", summarize_findings)
    
    workflow.set_entry_point("process")
    workflow.add_edge("process", "summarize")
    workflow.add_edge("summarize", END)
    
    return workflow.compile()
