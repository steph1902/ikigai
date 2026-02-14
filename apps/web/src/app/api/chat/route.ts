import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    // Get the last message from the user
    const lastMessage = messages[messages.length - 1];

    // Prepare payload for Orchestrator
    const payload = {
      user_id: "demo-user", // TODO: Get from session
      message: lastMessage.content,
      channel: "web",
      journey_id: "demo-journey", // TODO: Get from context/session
    };

    // Call Orchestrator
    const response = await fetch(
      `${process.env.ORCHESTRATOR_URL || "http://localhost:8000"}/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(`Orchestrator error: ${response.statusText}`);
    }

    const data = await response.json();

    // The Orchestrator returns { response: "...", state_snapshot: {...} }
    // We need to stream the text back to the client or just return it as a simple response
    // For now, simple response to support useChat's non-streaming or we simulate streaming

    // Vercel AI SDK expects a stream or a text response.
    // Since our orchestrator is currently request/response (not streaming SSE yet),
    // we return a standard response but formatted for the client.

    return NextResponse.json({ role: "assistant", content: data.response });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
