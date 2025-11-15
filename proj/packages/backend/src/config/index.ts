import path from "path";
import dotenv from "dotenv";

const envPath = path.resolve(__dirname, "../../../../.env");
console.log("Loading .env from:", envPath);

dotenv.config({ path: envPath });


dotenv.config({ path: envPath || ".env" });
function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    console.error(`❌ Missing environment variable: ${name}`);
    return undefined;
  }
  return value;
}

/* ----------------------------- ELASTICSEARCH ----------------------------- */

export const ELASTICSEARCH = {
  host: requireEnv("ES_HOST"),
  index: requireEnv("ES_INDEX"),
};

/* ---------------------------- GOOGLE (GMAIL) ----------------------------- */

export const GOOGLE = {
  // Gmail API OAuth ONLY
  gmailClientId: requireEnv("GOOGLE_GMAIL_CLIENT_ID"),
  gmailClientSecret: requireEnv("GOOGLE_GMAIL_CLIENT_SECRET"),
  gmailRedirectUri: requireEnv("GOOGLE_GMAIL_REDIRECT_URI"),
};

/* ------------------------------- GEMINI --------------------------------- */

export const GEMINI = {
  apiKey: requireEnv("GEMINI_API_KEY"), // used for classify + suggest reply
};

/* -------------------------------- SLACK --------------------------------- */

export const SLACK = {
  token: requireEnv("SLACK_TOKEN"),
  channel: requireEnv("SLACK_CHANNEL_ID"),
};

/* ------------------------------- WEBHOOK -------------------------------- */

export const WEBHOOK = {
  url: requireEnv("WEBHOOK_URL"),
};

/* ------------------------------ VECTOR DB ------------------------------- */

export const VECTOR_DB = {
  url: requireEnv("VECTOR_DB_URL"),
};

/* ----------------------------- DEBUG LOGS ------------------------------- */

console.log("Loaded Config:");
console.log(" - ES Host:", ELASTICSEARCH.host);
console.log(" - Gmail OAuth Client:", GOOGLE.gmailClientId);
console.log(" - Gemini API:", GEMINI.apiKey ? "Loaded" : "Missing");
console.log(" - Slack:", SLACK.token ? "Loaded" : "Missing");
console.log(" - Webhook URL:", WEBHOOK.url);
console.log(" - Vector DB:", VECTOR_DB.url);
