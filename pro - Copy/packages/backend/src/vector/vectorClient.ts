import weaviate, { WeaviateClient } from 'weaviate-ts-client'
import { VECTOR_DB } from '../config'

const client: WeaviateClient = weaviate.client({
  scheme: 'http',
  host: new URL(VECTOR_DB.url).host
})

const CLASS_NAME = 'Instructions'

// ensure schema exists
export async function ensureSchema() {
  const schema = await client.schema.getter().do()
  if (!schema.classes?.find(c => c.class === CLASS_NAME)) {
    await client.schema.classCreator().withClass({
      class: CLASS_NAME,
      vectorizer: 'none',
      properties: [
        { name: 'text', dataType: ['text'] }
      ]
    }).do()
  }
}
ensureSchema().catch(console.error)

export async function upsertInstruction(id: string, text: string, vector: number[]) {
  await client.data
    .creator()
    .withClassName(CLASS_NAME)
    .withId(id)
    .withProperties({ text })
    .withVector(vector)
    .do()
}

export async function upsertEmailVector(id: string, vector: number[], meta: any) {
  // optional: store email vector in ES only, skip Weaviate
}