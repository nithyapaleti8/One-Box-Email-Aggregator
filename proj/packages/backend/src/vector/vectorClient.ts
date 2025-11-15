import weaviate, { WeaviateClient } from "weaviate-ts-client"
import { VECTOR_DB } from "../config"

// Connect to Weaviate
export const client: WeaviateClient = weaviate.client({
  scheme: "http",
  host: new URL(VECTOR_DB.url!).host,
})

const CLASS_NAME = "Instructions"

/**
 * Ensure Weaviate schema exists
 */
export async function ensureSchema() {
  try {
    const schema = await client.schema.getter().do()

    const exists = schema.classes?.some(c => c.class === CLASS_NAME)
    if (!exists) {
      await client.schema.classCreator().withClass({
        class: CLASS_NAME,
        vectorizer: "none",
        properties: [
          { name: "text", dataType: ["text"] },
        ],
      }).do()

      console.log("✅ Created Weaviate class:", CLASS_NAME)
    }
  } catch (err) {
    console.error("❌ Schema error:", err)
  }
}

// Create schema on startup
ensureSchema()

/**
 * Insert or update instruction text + vector
 */
export async function upsertInstruction(id: string, text: string, vector: number[]) {
  try {
    await client.data
      .creator()
      .withClassName(CLASS_NAME)
      .withId(id)
      .withProperties({ text })
      .withVector(vector)
      .do()

    console.log("Stored instruction:", id)
  } catch (err) {
    console.error("❌ Failed to store instruction:", err)
  }
}

/**
 * Emails no longer stored in Weaviate (we removed Vertex embeddings)
 * So keep this clean + empty
 */
export async function upsertEmailVector(id: string, vector: number[], meta: any) {
  // No-op intentionally
  return
}
