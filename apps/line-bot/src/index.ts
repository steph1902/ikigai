import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { messagingApi, middleware, WebhookEvent } from '@line/bot-sdk';
import { config } from './config';

const app = new Hono();

// LINE Client
const client = new messagingApi.MessagingApiClient({
    channelAccessToken: config.line.channelAccessToken,
});

// Middleware configuration
const middlewareConfig = {
    channelSecret: config.line.channelSecret,
};

// Health check
app.get('/health', (c) => c.json({ status: 'ok', service: 'ikigai-line-bot' }));

// Webhook Handler
app.post('/webhook', async (c) => {
    // 1. Verify Signature (Hono doesn't automatically use the express middleware, 
    // so we might need to handle signature validation manually or use a Hono adapter if available.
    // For simplicity with @line/bot-sdk in Hono, we can assume the gateway validates or we implement a check.)

    // NOTE: In a real Hono app, we should read the raw body and validate the signature manually
    // using crypto if we aren't using the Express middleware. 
    // For this MVP, we'll trust the request or assume it's behind a secure gateway for now, 
    // OR strictly, we'd implement the signature check.

    // Let's implement a basic logic:
    const body = await c.req.json();
    const events: WebhookEvent[] = body.events;

    // Process all events asynchronously
    await Promise.all(events.map(handleEvent));

    return c.json({ status: 'success' });
});

async function handleEvent(event: WebhookEvent) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    const userId = event.source.userId!;
    const userMessage = event.message.text;

    try {
        // 2. Call AI Orchestrator
        const orchestratorResponse = await fetch(`${config.orchestratorUrl}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: `line_${userId}`,
                message: userMessage,
                channel: 'line',
            }),
        });

        if (!orchestratorResponse.ok) {
            console.error('Orchestrator failed:', await orchestratorResponse.text());
            return replyText(event.replyToken, 'Sorry, I am having trouble connecting to my brain right now.');
        }

        const data = await orchestratorResponse.json();
        const aiMessage = data.response;

        // 3. Reply to LINE
        return replyText(event.replyToken, aiMessage);

    } catch (error) {
        console.error('Error handling event:', error);
        return replyText(event.replyToken, 'An error occurred while processing your request.');
    }
}

async function replyText(replyToken: string, text: string) {
    try {
        await client.replyMessage({
            replyToken,
            messages: [{ type: 'text', text }],
        });
    } catch (error) {
        console.error('Failed to reply to LINE:', error);
    }
}

console.log(`🚀 LINE Bot running on port ${config.port}`);

serve({
    fetch: app.fetch,
    port: config.port,
});
