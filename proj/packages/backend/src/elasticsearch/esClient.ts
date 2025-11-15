import { Client } from '@elastic/elasticsearch'
import { ELASTICSEARCH } from '../config'

const client = new Client({ node: ELASTICSEARCH.host })

/* ------------------------------------------------------------------
 * Ensure index exists with correct mappings (Gmail-friendly)
 * ------------------------------------------------------------------ */
export async function ensureIndex() {
  const exists = await client.indices.exists({ index: ELASTICSEARCH.index })

  if (!exists) {
    await client.indices.create({
      index: ELASTICSEARCH.index,
      body: {
        mappings: {
          properties: {
            id:         { type: 'keyword' },   // internal ID
            gmailId:    { type: 'keyword' },   // Gmail message ID
            threadId:   { type: 'keyword' },
            accountId:  { type: 'keyword' },
            folder:     { type: 'keyword' },

            from:       { type: 'text' },
            to:         { type: 'text' },
            subject:    { type: 'text' },
            body:       { type: 'text' },

            date:       { type: 'date' },
            aiLabel:    { type: 'keyword' }
          }
        }
      }
    })

    console.log(`✔ Created index: ${ELASTICSEARCH.index}`)
  }
}

/* ------------------------------------------------------------------
 * Index / Upsert Email Document
 * ------------------------------------------------------------------ */
export async function indexEmail(doc: any) {
  // ES document ID (Gmail preferred)
  const id = doc.id || doc.gmailId || `${doc.accountId}-${Date.now()}`

  await client.index({
    index: ELASTICSEARCH.index,
    id,
    document: doc,
    refresh: true,
  })

  return id
}

/* ------------------------------------------------------------------
 * Get email by ID
 * ------------------------------------------------------------------ */
export async function getEmailById(id: string) {
  try {
    const resp = await client.get({
      index: ELASTICSEARCH.index,
      id
    })

    return resp._source || resp.body?._source
  } catch (err: any) {
    console.error("ES Get Error:", err.meta?.body?.error || err.message)
    throw new Error("Email not found")
  }
}

/* ------------------------------------------------------------------
 * Search Emails
 * ------------------------------------------------------------------ */
export async function searchEmails(params: {
  accountId?: string
  folder?: string
  label?: string
  query?: string
  from?: number
  size?: number
}) {
  const { accountId, folder, label, query, from = 0, size = 20 } = params

  const must: any[] = []

  if (accountId) must.push({ term: { accountId } })
  if (folder)    must.push({ term: { folder } })
  if (label)     must.push({ term: { aiLabel: label } })

  if (query) {
    must.push({
      multi_match: {
        query,
        fields: ["subject^2", "body", "from"],
        fuzziness: "AUTO",
      }
    })
  }

  const result = await client.search({
    index: ELASTICSEARCH.index,
    from,
    size,
    query: { bool: { must } }
  })

  return result.hits.hits.map(hit => hit._source)
}

/* ------------------------------------------------------------------
 * Initialize index on startup
 * ------------------------------------------------------------------ */
ensureIndex().catch(console.error)
