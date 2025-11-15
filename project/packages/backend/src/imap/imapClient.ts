import { ImapFlow } from 'imapflow'
import { IMAP_ACCOUNTS } from '../config'
import dayjs from 'dayjs'
import { indexEmail } from '../elasticsearch/esClient'
import { classifyEmail } from '../ai/classify'
import { embedEmail } from '../ai/embed'
import { onInterested } from '../notifications/notificationService'
import { upsertEmailVector } from '../vector/vectorClient'

export async function startImapSync() {
  for (const account of IMAP_ACCOUNTS) {
    console.log("Connecting to IMAP account:", account.auth.user);

    const client = new ImapFlow(account);

    try {
      await client.connect();

      // 1) List all mailboxes using the correct API
      for await (let mailbox of client.list()) {
        const path = mailbox.path;

        console.log("Syncing mailbox:", path);

        const lock = await client.getMailboxLock(path);
        try {
          const since = dayjs().subtract(30, "day").toDate();

          // Fetch emails
          for await (let msg of client.fetch(
            { since },
            { envelope: true, source: true, uid: true }
          )) {
            await processMessage(account.auth.user, path, msg.uid, msg);
          }
        } finally {
          lock.release();
        }
      }

      // 2) New email listener
      client.on("exists", async (seq) => {
        const mailbox = await client.mailboxOpen(undefined, { uid: true });
        const [msg] = await client.fetch(
          { uid: seq },
          { envelope: true, source: true, uid: true }
        );

        await processMessage(account.auth.user, mailbox.path, msg.uid, msg);
      });

    } catch (err) {
      console.error(`❌ IMAP Connection error for: ${account.auth.user}`, err);
    }
  }
}

async function processMessage(accountId: string, folder: string, uid: number, msg: any) {
  const email = {
    accountId,
    folder,
    uid,
    from: msg.envelope.from,
    to: msg.envelope.to,
    subject: msg.envelope.subject,
    date: msg.envelope.date,
    body: msg.source.toString("utf-8"),
  };

  // Classification
  const label = await classifyEmail(email);

  // Index in Elasticsearch
  await indexEmail({ ...email, aiLabel: label });

  // Embed + Vector DB
  const vector = await embedEmail(email.body);
  await upsertEmailVector(uid.toString(), vector, {
    accountId,
    subject: email.subject,
  });

  // Notifications
  if (label === "Interested") {
    await onInterested(email);
  }
}
