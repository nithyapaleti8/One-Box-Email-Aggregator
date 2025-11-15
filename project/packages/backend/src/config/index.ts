import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

// Elasticsearch
export const ELASTICSEARCH = {
  host: process.env.ES_HOST,
  index: process.env.ES_INDEX,
};

// Google Vertex AI
export const GOOGLE = {
  projectId: process.env.GOOGLE_PROJECT_ID,
  region: process.env.GOOGLE_REGION,
  classifyEndpoint: process.env.VERTEX_AI_CLASSIFY_ENDPOINT,
  embedEndpoint: process.env.VERTEX_AI_EMBED_ENDPOINT,
  chatEndpoint: process.env.VERTEX_AI_CHAT_ENDPOINT,
};

// IMAP Accounts
export const IMAP_ACCOUNTS = [
  {
    host: process.env.IMAP_HOST_1,
    port: Number(process.env.IMAP_PORT_1),
    secure: true,
    auth: {
      user: process.env.IMAP_USER_1,
      pass: process.env.IMAP_PASS_1,
    },
  },
  {
    host: process.env.IMAP_HOST_2,
    port: Number(process.env.IMAP_PORT_2),
    secure: true,
    auth: {
      user: process.env.IMAP_USER_2,
      pass: process.env.IMAP_PASS_2,
    },
  },
];

// Slack
export const SLACK = {
  token: process.env.SLACK_TOKEN,
  channel: process.env.SLACK_CHANNEL_ID,
};

// Webhook
export const WEBHOOK = {
  url: process.env.WEBHOOK_URL,
};

export const VECTOR_DB = {
  url: process.env.VECTOR_DB_URL,
};
