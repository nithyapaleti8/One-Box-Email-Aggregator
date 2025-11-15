import { PredictionServiceClient } from '@google-cloud/aiplatform'
import { GOOGLE } from '../config'

const client = new PredictionServiceClient()

const LABELS = [
  'Interested',
  'Meeting Booked',
  'Not Interested',
  'Spam',
  'Out of Office'
]

export async function classifyEmail(email: {
  subject: string
  body: string
}): Promise<string> {
  // Build the full endpoint resource name:
  // e.g. projects/{project}/locations/{region}/endpoints/{endpointId}
  const endpoint = GOOGLE.classifyEndpoint

  // Our prompt as the single instance
  const instance = {
    content: `
Classify the following email into one of: ${LABELS.join(', ')}.

Subject: ${email.subject}
Body:
${email.body}
`
  }

  const [response] = await client.predict({
    endpoint,
    instances: [instance],
    parameters: { 
      // maxOutputTokens, temperature, etc.
      temperature: 0.0,
      maxOutputTokens: 16
    }
  })

  // `response.predictions` is an array of prediction objects
  // Many built-in models return { content: "Label" }
  const prediction = (response.predictions?.[0] as any)?.content?.trim()
  if (LABELS.includes(prediction)) return prediction
  return 'Not Interested'
}