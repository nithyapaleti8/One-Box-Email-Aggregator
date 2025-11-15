import { google } from "googleapis";
import express from "express";

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_GMAIL_CLIENT_ID,
  process.env.GOOGLE_GMAIL_CLIENT_SECRET,
  process.env.GOOGLE_GMAIL_REDIRECT_URI 
);

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.send"
];

/**
 * STEP 1:
 * Redirect user to Google login (Gmail OAuth screen)
 */
router.get("/login", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // ensures refresh_token always returned
  });

  res.redirect(url);
});

/**
 * STEP 2:
 * Google redirects user back → exchange code for tokens
 */
router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).send("Missing OAuth code");
    }

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    console.log("🔐 Gmail OAuth Tokens Received:");
    console.log(JSON.stringify(tokens, null, 2));

    // 👉 Store refresh_token in DB (.env for now, later in DB)
    // Example:
    // await saveUserToken(tokens.refresh_token)

    res.send(`
      <h2>Gmail Connected Successfully 🎉</h2>
      You can close this tab now.
    `);
  } catch (err) {
    console.error("OAuth Error:", err);
    res.status(500).send("OAuth Failed");
  }
});

export default router;
