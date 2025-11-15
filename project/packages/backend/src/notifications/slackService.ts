import { WebClient } from '@slack/web-api'
import { SLACK } from '../config'

const slack = new WebClient(SLACK.token)

export async function notifySlack(email: {
  subject: string
  from: any
  folder: string
  accountId: string
}) {
  const text = `*New Interested Email* from ${email.from?.[0]?.address}\n` +
    `Account: ${email.accountId}\nFolder: ${email.folder}\nSubject: ${email.subject}`

  await slack.chat.postMessage({
    channel: SLACK.channel,
    text
  })
}