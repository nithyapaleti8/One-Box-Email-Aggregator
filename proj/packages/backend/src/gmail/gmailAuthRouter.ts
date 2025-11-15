import express from "express";
import { google } from "googleapis";
import { GOOGLE } from "../config";
import fs from "fs";
import path from "path";

const router = express.Router();

/* -------------------------------------------
   OAuth Client
-------------------------------------------- */
export const oauth2Client = new google.auth.OAuth2(
  GOOGLE.gmailClientId,
  GOOGLE.gmailClientSecret,
  GOOGLE.gmailRedirectUri
);

/* -------------------------------------------
   Gmail Scopes
-------------------------------------------- */
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.send",
];

/* -------------------------------------------
   1) LOGIN — Redirect to Google
-------------------------------------------- */
router.get("/login", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",   // ensures refresh token
    scope: SCOPES,
  });

  console.log("Redirecting user to:", url);
  res.redirect(url);
});

/* -------------------------------------------
   2) CALLBACK — Google returns ?code=
-------------------------------------------- */
router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).send("No ?code provided by Google.");
    }

    // Exchange auth code → tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log("✔ Gmail Tokens Received (store safely):");
    console.log(tokens);

    // Save token for later use
    const tokenFile = path.join(process.cwd(), "gmail_token.json");
    fs.writeFileSync(tokenFile, JSON.stringify(tokens, null, 2));

    res.send("🎉 Gmail connected successfully! You can close this tab.");
  } catch (err: any) {
    console.error("❌ OAuth Error:", err);
    res.status(500).send("Gmail OAuth Failed. Check backend logs.");
  }
});

export default router;
