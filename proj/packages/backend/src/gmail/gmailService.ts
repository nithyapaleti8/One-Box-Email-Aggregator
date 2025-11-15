import { getGmailClient } from "./gmailClient";
import { indexEmail } from "../elasticsearch/esClient";

function decodeBase64(data: string) {
  return Buffer.from(data, "base64").toString("utf8");
}

export async function fetchEmailsFromGmail() {
  const gmail = getGmailClient();

  // 1) List message IDs
  const list = await gmail.users.messages.list({
    userId: "me",
    maxResults: 20
  });

  if (!list.data.messages) return [];

  const emails = [];

  for (const msg of list.data.messages) {
    const detail = await gmail.users.messages.get({
      userId: "me",
      id: msg.id!
    });

    const payload = detail.data.payload!;
    const headers = payload.headers || [];

    const subject = headers.find(h => h.name === "Subject")?.value || "";
    const from = headers.find(h => h.name === "From")?.value || "";
    const date = headers.find(h => h.name === "Date")?.value || "";

    let body = "";

    if (payload.body?.data) {
      body = decodeBase64(payload.body.data);
    } else if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === "text/plain" && part.body?.data) {
          body = decodeBase64(part.body.data);
        }
      }
    }

    const email = {
      id: msg.id,
      accountId: "gmail",
      folder: "INBOX",
      from,
      subject,
      body,
      date,
      aiLabel: "Neutral"
    };

    emails.push(email);

    // index into ES
    await indexEmail({
      accountId: "gmail",
      uid: msg.id,
      folder: "INBOX",
      from,
      subject,
      body,
      date,
      aiLabel: "Neutral"
    });
  }

  return emails;
}
