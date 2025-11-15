/* =======================================================================
   gmailClient.ts — FINAL WORKING VERSION
   Handles Gmail fetching
   ======================================================================= */

import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { oauth2Client } from "./gmailAuthRouter";

const TOKEN_PATH = path.join(process.cwd(), "gmail_token.json");

/* =======================================================================
   LOAD AUTH TOKEN
   ======================================================================= */
export function loadGmailAuth() {
  if (!fs.existsSync(TOKEN_PATH)) {
    console.log("⚠️ No Gmail token found. Login first at /gmail/login");
    return null;
  }

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  oauth2Client.setCredentials(token);

  return google.gmail({ version: "v1", auth: oauth2Client });
}

/* =======================================================================
   FETCH INBOX (LIST + EXPAND)
   ======================================================================= */
export async function fetchInboxEmails() {
  const gmail = loadGmailAuth();
  if (!gmail) return [];

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 25,
  });

  const messages = res.data.messages || [];
  const emails: any[] = [];

  for (const msg of messages) {
    const full = await gmail.users.messages.get({
      userId: "me",
      id: msg.id!,
      format: "full",
    });

    emails.push(formatEmail(full));
  }

  return emails;
}

/* =======================================================================
   FETCH SINGLE EMAIL
   ======================================================================= */
export async function fetchSingleEmail(id: string) {
  const gmail = loadGmailAuth();
  if (!gmail) return null;

  const full = await gmail.users.messages.get({
    userId: "me",
    id,
    format: "full",
  });

  return formatEmail(full);
}

/* =======================================================================
   FORMAT EMAIL → FRONTEND SHAPE
   ======================================================================= */
function formatEmail(full: any) {
  const payload = full.data.payload;
  const headers = payload?.headers || [];

  function getHeader(name: string) {
    return headers.find((h: any) => h.name === name)?.value || "";
  }

  const bodyData =
    payload?.parts?.[0]?.body?.data ||
    payload?.body?.data ||
    "";

  let body = "";
  if (bodyData) {
    body = Buffer.from(bodyData, "base64").toString("utf8");
  }

  return {
    id: full.data.id,
    subject: getHeader("Subject"),
    from: getHeader("From"),
    to: getHeader("To"),
    date: getHeader("Date"),
    snippet: full.data.snippet,
    body,
  };
}
