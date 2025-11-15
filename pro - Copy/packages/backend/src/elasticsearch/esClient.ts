import { Client } from '@elastic/elasticsearch'
import { ELASTICSEARCH } from '../config'

const client = new Client({ node: ELASTICSEARCH.host })

export async function ensureIndex() {
  const exists = await client.indices.exists({ index: ELASTICSEARCH.index })
  if (!exists) {
    await client.indices.create({
      index: ELASTICSEARCH.index,
      body: {
        mappings: {
          properties: {
            accountId: { type: 'keyword' },
            folder: { type: 'keyword' },
            from: { type: 'text' },
            to: { type: 'text' },
            subject: { type: 'text' },
            body: { type: 'text' },
            date: { type: 'date' },
            aiLabel: { type: 'keyword' },
          }
        }
      }
    })
  }
}

export async function indexEmail(doc: any) {
  await client.index({
    index: ELASTICSEARCH.index,
    id: `${doc.accountId}-${doc.uid}`,
    body: doc,
    refresh: 'true'
  })
}

export async function getEmailById(id: string) {
  const resp = await client.get({
    index: ELASTICSEARCH.index,
    id
  })
  return resp.body._source as any
}

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
  if (query)     must.push({ match: { body: query } })

  const result = await client.search({
    index: ELASTICSEARCH.index,
    from,
    size,
    body: { query: { bool: { must } } }
  })
  return result.hits.hits.map(hit => hit._source)
}

// Initialize on startup
ensureIndex().catch(console.error)