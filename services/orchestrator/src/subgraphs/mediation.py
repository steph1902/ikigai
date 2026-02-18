from typing import TypedDict, Literal
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from langgraph.graph import StateGraph, END
from src.models.state import AgentState

# Output structure for the classifier
class IntentClassification(BaseModel):
    category: Literal["A", "B", "C"] = Field(
        ..., 
        description="The risk category of the user's request. A=Info/Search, B=Logistics/Scheduling, C=Negotiation/Legal/Contract"
    )
    routing: Literal["search", "viewing", "transaction", "document", "renovation", "general_chat", "handoff"] = Field(
        ...,
        description="The target agent to route to based on intent."
    )
    reasoning: str = Field(..., description="Brief explanation of the classification.")

def create_mediation_subgraph():
    # LLM Setup
    llm = ChatAnthropic(model="claude-3-haiku-20240307", temperature=0)
    structured_llm = llm.with_structured_output(IntentClassification)

    # Prompt
    system_prompt = """
    You are the Mediation Boundary for a Japanese Real Estate AI.
    Your job is to CLASSIFY user requests into three safety categories and ROUTE them appropriate.

    ### SAFETY CATEGORIES
    - **Category A (Information)**: Safe to answer autonomously. Public info, property specs, search criteria, general questions.
      - Routing: 'search', 'renovation', 'document', 'general_chat'
    - **Category B (Logistics)**: Safe to answer autonomously. Scheduling viewings, requesting forms.
      - Routing: 'viewing'
    - **Category C (Negotiation/Legal)**: UNSAFE for AI. Requires human intervention.
      - Topics: Price negotiation/discounts, contract terms interpretation, legal advice, specific claim validity, drafting clauses.
      - Routing: 'handoff'

    ### ROUTING GUIDELINES
    - Search/Find/Apartment -> 'search'
    - View/Book/See -> 'viewing'
    - Buy/Offer/Contract/Mortgage/Loan -> 'transaction' BUT if it involves negotiation terms -> 'handoff'
    - Renovate/Remodel/Fix -> 'renovation'
    - Analyze/Document/PDF -> 'document'
    - Negotiation/Discount/Is this legal? -> 'handoff'
    - Hello/Help -> 'general_chat'

    Analyze the user's latest message and classify.
    """

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}")
    ])

    classifier_chain = prompt | structured_llm

    # Nodes
    def classify_input(state: AgentState):
        messages = state['messages']
        if not messages:
            return {"next_step": "general_chat"}
        
        last_message = messages[-1].content
        try:
            result = classifier_chain.invoke({"input": last_message})
            print(f"DEBUG: Mediation Classification: {result}")
            
            # Additional safety check for C
            if result.category == "C":
                return {"next_step": "handoff"}
                
            return {"next_step": result.routing}
        except Exception as e:
            print(f"Error in classifier: {e}")
            return {"next_step": "general_chat"}

    def handoff_node(state: AgentState):
        return {
            "messages": [{
                "role": "assistant",
                "content": "I apologize, but I cannot assist with negotiations, legal advice, or contract term interpretations directly. I have forwarded your request to a licensed human agent who will contact you shortly."
            }]
        }

    # Graph
    workflow = StateGraph(AgentState)
    workflow.add_node("classifier", classify_input)
    workflow.add_node("handoff", handoff_node)

    workflow.set_entry_point("classifier")

    # We don't route to other agents HERE, we just set the next_step in state.
    # The MAIN graph will handle the actual routing based on next_step.
    # BUT, if it's handoff, we handle it here and end.
    
    def route_outcome(state: AgentState):
        if state.get("next_step") == "handoff":
            return "handoff"
        return END

    workflow.add_conditional_edges(
        "classifier",
        route_outcome,
        {
            "handoff": "handoff",
            END: END
        }
    )
    
    workflow.add_edge("handoff", END)

    return workflow.compile()
