// backend/src/api/server.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";

const envPath = path.resolve(__dirname, "../../../../.env");
console.log("Loading .env from:", envPath);
dotenv.config({ path: envPath });

// Config
import { ELASTICSEARCH, GOOGLE } from "../config";

// Gmail Routes + Gmail Client
import gmailAuthRouter from "../gmail/gmailAuthRouter";
import { debugGmailStatus, fetchInboxEmails, fetchSingleEmail } from "../gmail/gmailClient";

// RAG
import { suggestReply } from "../vector/ragService";

// Elasticsearch
import { searchEmails } from "../elasticsearch/esClient";

// EXPRESS
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// HEALTH
app.get("/health", (_req, res) => res.send({ status: "ok" }));

// Gmail OAuth
app.use("/gmail", gmailAuthRouter);

// LIST EMAILS
app.get("/emails", async (_req, res) => {
  try {
    debugGmailStatus();
    const emails = await fetchInboxEmails();
    console.log("📨 Returning emails to frontend:", emails.length);

    res.json(emails);
  } catch (err: any) {
    console.error("❌ Gmail inbox error:", err);
    res.status(500).json({ error: err.message });
  }
});

// SINGLE EMAIL
app.get("/emails/:id", async (req, res) => {
  try {
    const email = await fetchSingleEmail(req.params.id);
    res.json(email);
  } catch (err: any) {
    console.error("❌ Email fetch error:", err);
    res.status(404).json({ error: "Email not found" });
  }
});

// AI SUGGEST REPLY
app.post("/suggest-reply/:id", async (req, res) => {
  try {
    const email = await fetchSingleEmail(req.params.id);
    const body = email?.body || email?.snippet || "";

    const reply = await suggestReply(body);
    res.json({ reply });
  } catch (err: any) {
    console.error("❌ Suggest reply error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Elasticsearch search
app.get("/search", async (req, res) => {
  try {
    const results = await searchEmails({
      query: req.query.q as string,
      size: 20
    });
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
