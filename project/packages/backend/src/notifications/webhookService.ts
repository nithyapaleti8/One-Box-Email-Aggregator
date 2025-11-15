import axios from 'axios'
import { WEBHOOK_URL } from '../config'

export async function notifyWebhook(payload: any) {
  await axios.post(WEBHOOK_URL, payload)
}