import { WebClient } from '@slack/web-api'
import { SLACK } from '../config'

const slack = new WebClient(SLACK.token)

export async function notifySlack(email: {
  id?: string
  accountId: string
  subject: string
  from: string
  date?: string
  snippet?: string
}) {
  const message = `
*📩 New Interested Email Detected!*
*From:* ${email.from}
*Account:* ${email.accountId}
*Subject:* ${email.subject}
*Date:* ${email.date || "(unknown)"}

*Preview:* ${email.snippet || "No preview available"}
  `.trim()

  await slack.chat.postMessage({
    channel: SLACK.channel,
    text: message
  })
}
