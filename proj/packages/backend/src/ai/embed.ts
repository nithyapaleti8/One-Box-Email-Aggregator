import fetch from "node-fetch";

const LABELS = [
  "Interested",
  "Meeting Booked",
  "Not Interested",
  "Spam",
  "Out of Office"
];

export async function classifyEmail(email: { subject: string; body: string }) {
  const prompt = `
Classify the following email into one of: ${LABELS.join(", ")}.
Subject: ${email.subject}
Body: ${email.body}
Just return the label.
`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  const output = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (LABELS.includes(output)) return output;
  return "Not Interested";
}
