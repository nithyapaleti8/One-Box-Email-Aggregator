import path from "path";
import dotenv from "dotenv";

console.log("DEBUG 1: cwd =", process.cwd());
console.log("DEBUG 2: __dirname =", __dirname);

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

console.log("DEBUG 3: ES_HOST =", process.env.ES_HOST);


import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { startImapSync } from '../imap/imapClient';
import { searchEmails, getEmailById } from '../elasticsearch/esClient';
import { suggestReply } from '../vector/ragService';



// ─── Server Setup ──────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// ─── Routes ────────────────────────────────────────────────────────────────

// Health check
app.get('/health', (_req, res) => res.send({ status: 'ok' }));

// 1) Search / list emails
app.get('/emails', async (req, res) => {
  try {
    const { accountId, folder, label, q, from, size } = req.query;

    const results = await searchEmails({
      accountId: accountId as string,
      folder: folder as string,
      label: label as string,
      query: q as string,
      from: Number(from) || 0,
      size: Number(size) || 20,
    });

    res.json(results);
  } catch (err: any) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2) Fetch single email
app.get('/emails/:id', async (req, res) => {
  try {
    const email = await getEmailById(req.params.id);
    res.json(email);
  } catch (err: any) {
    console.error("Email by ID error:", err);
    res.status(404).json({ error: 'Email not found' });
  }
});

// 3) Suggest reply (RAG + Vector DB)
app.post('/suggest-reply/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const email = await getEmailById(id);

    if (!email || !email.body) {
      return res.status(400).json({ error: "Email body missing" });
    }

    const reply = await suggestReply(email.body);
    res.json({ reply });
  } catch (err: any) {
    console.error("Reply suggestion error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Start Server + IMAP ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  startImapSync().catch(console.error);
});
