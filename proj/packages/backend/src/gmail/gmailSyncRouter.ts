import express from "express";
import { fetchEmailsFromGmail } from "./gmailService";

const router = express.Router();

router.get("/sync", async (_req, res) => {
  try {
    const emails = await fetchEmailsFromGmail();
    res.json({ success: true, count: emails.length });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
