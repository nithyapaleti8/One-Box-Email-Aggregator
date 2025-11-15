// frontend/src/services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  timeout: 8000
});

export async function fetchGmailMessages() {
  console.log("🌐 FRONTEND → GET /emails");

  try {
    const res = await API.get("/emails");
    console.log("🌐 FRONTEND RECEIVED EMAILS:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ FRONTEND /emails error:", err);
    return [];
  }
}

export async function fetchGmailMessageById(id: string) {
  console.log("🌐 FRONTEND → GET /emails/" + id);

  try {
    const res = await API.get("/emails/" + id);
    console.log("🌐 FRONTEND RECEIVED EMAIL:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ FRONTEND /emails/:id error:", err);
    return null;
  }
}

export async function postSuggestReply(id: string) {
  try {
    const res = await API.post(`/suggest-reply/${id}`);
    return res.data.reply;
  } catch (err) {
    return "AI reply failed.";
  }
}
