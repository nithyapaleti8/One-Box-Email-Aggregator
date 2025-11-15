import { notifySlack } from './slackService'
import { notifyWebhook } from './webhookService'

export async function onInterested(email: any) {
  const payload = {
    accountId: email.accountId,
    folder: email.folder,
    subject: email.subject,
    from: email.from,
    date: email.date
  }
  await Promise.all([
    notifySlack(email),
    notifyWebhook(payload)
  ])
}