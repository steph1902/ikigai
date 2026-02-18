from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.graph import create_graph
from src.models.state import AgentState
from langchain_core.messages import HumanMessage
from typing import Dict, Any, List, Optional
import uvicorn
import uuid

from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="IKIGAI Orchestrator")

# Ensure documents directory exists
os.makedirs("public/documents", exist_ok=True)
app.mount("/documents", StaticFiles(directory="public/documents"), name="documents")

# Compile the graph on startup
graph = create_graph()

class ChatInput(BaseModel):
    user_id: str
    message: str
    channel: str = "web"
    thread_id: str = "default"

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ikigai-orchestrator"}

@app.post("/chat")
async def chat(input: ChatInput):
    # Initialize state
    # Must match AgentState TypedDict in src/models/state.py
    initial_state = {
        "messages": [HumanMessage(content=input.message)],
        "user_id": input.user_id,
        "thread_id": input.thread_id,
        "user_preferences": {},
        "next_step": None,
        "current_property_id": None,
        "search_filters": {}
    }
    
    try:
        # Run the graph
        # For now, simplistic stateless invoke
        # In production, we would use a checkpointer to persist state between turns
        result = await graph.ainvoke(initial_state)
        
        # Extract the last message content
        last_message = result["messages"][-1]
        response_content = last_message.content
        
        return {
            "response": response_content,
            "thread_id": input.thread_id
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
