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
  const endpoint = GOOGLE.classifyEndpoint
  if (!endpoint) {
    console.error("❌ Vertex AI classify endpoint missing.")
    return "Not Interested"
  }

  const instance = {
    content: `
Classify the following email into exactly one of these labels:
${LABELS.join(', ')}

Subject: ${email.subject}
Body:
${email.body}
`
  }

  try {
    const [response] = await client.predict({
      endpoint,
      instances: [instance],
      parameters: {
        temperature: 0,
        maxOutputTokens: 8
      }
    })

    const prediction = (response.predictions?.[0] as any)?.content?.trim()

    if (prediction && LABELS.includes(prediction)) {
      return prediction
    }

    console.warn("⚠ Unexpected classify result:", prediction)
    return "Not Interested"

  } catch (err) {
    console.error("❌ Vertex classify error:", err)
    return "Not Interested"
  }
}
