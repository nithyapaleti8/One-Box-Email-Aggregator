import { notifySlack } from './slackService'
import { notifyWebhook } from './webhookService'

export async function onInterested(email: any) {
  const payload = {
    id: email.id || email.gmailId,
    accountId: email.accountId,
    subject: email.subject,
    from: email.from,
    date: email.date,
    snippet: email.body?.slice(0, 140) || ""
  }

  await Promise.all([
    notifySlack(payload),
    notifyWebhook(payload)
  ])
}
