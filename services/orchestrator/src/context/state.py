from typing import TypedDict, Annotated, Sequence, List, Dict, Any, Optional
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    # Conversation
    messages: Annotated[Sequence[BaseMessage], add_messages]
    user_id: str
    journey_id: str
    channel: str  # 'web' | 'mobile' | 'line' | 'voice'
    language: str  # 'ja' | 'en'

    # Intent
    classified_intent: str
    intent_confidence: float

    # Journey context
    search_criteria: Dict[str, Any]
    shortlisted_properties: List[Dict[str, Any]]
    active_transactions: List[Dict[str, Any]]
    journey_state_summary: str

    # Current turn
    pending_action: Optional[Dict[str, Any]]
    action_result: Optional[Dict[str, Any]]
    tool_calls: List[Dict[str, Any]]

    # Control
    should_escalate: bool
    escalation_reason: Optional[str]
    turn_count: int
    total_tokens_this_turn: int
