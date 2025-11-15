import weaviate from "weaviate-ts-client"
import { VECTOR_DB } from "../config"

// Connect to Weaviate
const clientWV = weaviate.client({
  scheme: "http",
  host: new URL(VECTOR_DB.url!).host
})

const CLASS_NAME = "Instructions"

/**
 * Simple fallback AI generator (since Vertex AI is removed)
 */
function generateReply(context: string, emailBody: string): string {
  return `
Thanks for reaching out!

Based on your message:

"${emailBody.slice(0, 200)}..."

Here is a helpful response:

${context || "I will get back to you shortly."}

Let me know if you'd like to discuss this further.
  `.trim()
}

/**
 * Suggest reply using vector similarity + simple local generation
 */
export async function suggestReply(emailBody: string): Promise<string> {
  // 1) Search Weaviate
  let context = ""

  try {
    const res = await clientWV.graphql
      .get()
      .withClassName(CLASS_NAME)
      .withFields("text")
      .withNearText({ concepts: [emailBody] })
      .withLimit(3)
      .do() as any

    const items = res?.data?.Get?.[CLASS_NAME] ?? []
    context = items.map((i: any) => i.text).join("\n\n")
  } catch (err) {
    console.error("Weaviate query failed:", err)
  }

  // 2) Generate a reply using local rules
  return generateReply(context, emailBody)
}
