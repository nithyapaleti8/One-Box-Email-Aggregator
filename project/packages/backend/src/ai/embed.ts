import { PredictionServiceClient } from '@google-cloud/aiplatform'
import { GOOGLE } from '../config'

const client = new PredictionServiceClient()

export async function embedEmail(text: string): Promise<number[]> {
  const endpoint = GOOGLE.embedEndpoint

  const instance = {
    // some embedding endpoints expect `{ text: "..." }`
    text
  }

  const [response] = await client.predict({
    endpoint,
    instances: [instance],
    // embedding models often ignore temperature
    parameters: { }
  })

  // Vertex AI embeddings typically return { embeddings: [...] }
  const embeddings = (response.predictions?.[0] as any)?.embeddings
  if (!Array.isArray(embeddings)) {
    throw new Error('Invalid embedding response from Vertex AI')
  }
  return embeddings
}