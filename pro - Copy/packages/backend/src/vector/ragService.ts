import { PredictionServiceClient } from '@google-cloud/aiplatform'
import { embedEmail } from '../ai/embed'
import { GOOGLE } from '../config'
import weaviate, { WeaviateClient } from 'weaviate-ts-client'

const clientVA = new PredictionServiceClient()
const clientWV = weaviate.client({
  scheme: 'http',
  host: new URL(process.env.VECTOR_DB_URL!).host
})

const CLASS_NAME = 'Instructions'

// … ensureSchema + upsertInstruction as before …

export async function suggestReply(emailBody: string): Promise<string> {
  // 1) embed incoming email
  const queryVector = await embedEmail(emailBody)

  // 2) retrieve top 3 instruction texts from Weaviate
  const res = await clientWV.graphql.get()
    .withClassName(CLASS_NAME)
    .withFields('text')
    .withNearVector({ vector: queryVector })
    .withLimit(3)
    .do() as any

  const contexts: string = res.data.Get.Instructions
    .map((i: any) => i.text)
    .join('\n\n')

  // 3) call Vertex AI Chat/Gemini endpoint
  const endpoint = GOOGLE.chatEndpoint
  const prompt = `
You are an expert email assistant. Use the following context instructions to craft a reply.

Context:
${contexts}

Email:
${emailBody}

Reply:
`

  const instance = { content: prompt }

  const [response] = await clientVA.predict({
    endpoint,
    instances: [instance],
    parameters: {
      temperature: 0.7,
      maxOutputTokens: 256
    }
  })

  const reply = (response.predictions?.[0] as any)?.content
  return reply?.trim() ?? ''
}