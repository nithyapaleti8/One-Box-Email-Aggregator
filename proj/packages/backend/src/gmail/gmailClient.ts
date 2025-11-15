// backend/src/gmail/gmailClient.ts
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { oauth2Client } from "./gmailAuthRouter";

const TOKEN_PATH = path.join(process.cwd(), "gmail_token.json");

/* ======================================================
   DEBUG: Check token + Gmail readiness 
   ======================================================*/
export function debugGmailStatus() {
  console.log("\n=========== 📧 GMAIL DEBUG STATUS ===========");
  console.log("Token path:", TOKEN_PATH);
  const exists = fs.existsSync(TOKEN_PATH);
  console.log("Token exists:", exists);

  if (exists) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    console.log("Access token:", token.access_token?.slice(0, 20) + "...");
    console.log("Refresh token:", token.refresh_token ? "OK" : "❌ Missing");
    console.log("Expiry:", token.expiry_date);
  }

  console.log("=============================================\n");
}

/* ======================================================
   LOAD GMAIL CLIENT
   ======================================================*/
export function loadGmailClient() {
  if (!fs.existsSync(TOKEN_PATH)) {
    console.log("❌ No gmail_token.json → Login at /gmail/login");
    return null;
  }

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  oauth2Client.setCredentials(token);

  return google.gmail({ version: "v1", auth: oauth2Client });
}

/* ======================================================
   BASE64 Decode (Gmail safe)
   ======================================================*/
function base64Decode(data?: string) {
  if (!data) return "";
  data = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(data, "base64").toString("utf8");
}

/* ======================================================
   FETCH INBOX EMAILS (20)
   ======================================================*/
export async function fetchInboxEmails() {
  const gmail = loadGmailClient();
  if (!gmail) return [];

  console.log("📥 Step 1: Fetching Gmail inbox list…");

  const listRes = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"],
    maxResults: 20
  });

  const messages = listRes.data.messages || [];
  console.log("📌 Step 2: Gmail returned IDs:", messages.length);

  const emails: any[] = [];

  for (const msg of messages) {
    console.log("🔍 Fetching full email:", msg.id);

    const full = await gmail.users.messages.get({
      userId: "me",
      id: msg.id!,
      format: "full"
    });

    const payload = full.data.payload;
    const headers = payload?.headers || [];

    const get = (n: string) =>
      headers.find((h) => h.name.toLowerCase() === n.toLowerCase())?.value || "";

    let body = "";
    if (payload?.parts) {
      const part = payload.parts.find((p) => p.mimeType === "text/plain");
      body = base64Decode(part?.body?.data);
    } else {
      body = base64Decode(payload?.body?.data);
    }

    const email = {
      id: msg.id,
      subject: get("Subject"),
      from: get("From"),
      to: get("To"),
      date: get("Date"),
      snippet: full.data.snippet,
      body
    };

    console.log("📨 Parsed email:", email.subject);
    emails.push(email);
  }

  console.log("✅ Step 3: Returning", emails.length, "emails");
  return emails;
}

/* ======================================================
   FETCH SINGLE EMAIL
   ======================================================*/
export async function fetchSingleEmail(id: string) {
  const gmail = loadGmailClient();
  if (!gmail) return null;

  console.log("📧 Fetch single email:", id);

  const full = await gmail.users.messages.get({
    userId: "me",
    id,
    format: "full"
  });

  const payload = full.data.payload;
  const headers = payload?.headers || [];

  const get = (name: string) =>
    headers.find((h) => h.name === name)?.value || "";

  let body = "";
  if (payload?.parts) {
    const part = payload.parts.find((p) => p.mimeType === "text/plain");
    body = base64Decode(part?.body?.data);
  } else {
    body = base64Decode(payload?.body?.data);
  }

  return {
    id,
    subject: get("Subject"),
    from: get("From"),
    to: get("To"),
    date: get("Date"),
    snippet: full.data.snippet,
    body
  };
}
