import dotenv from "dotenv";

dotenv.config({ path: "../../.env" }); // Load from root .env if running locally

export const config = {
  port: Number(process.env.PORT || 8005),
  line: {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
    channelSecret: process.env.LINE_CHANNEL_SECRET || "",
  },
  orchestratorUrl: process.env.ORCHESTRATOR_URL || "http://localhost:8000",
};
