import axios from 'axios'
import { WEBHOOK } from '../config'

export async function notifyWebhook(payload: any) {
  if (!WEBHOOK.url) {
    console.error("❌ WEBHOOK_URL is missing. Skipping webhook notification.")
    return
  }

  try {
    await axios.post(WEBHOOK.url, payload)
  } catch (err: any) {
    console.error("❌ Webhook notification failed:", err.message)
  }
}
