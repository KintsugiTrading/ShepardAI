import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `You are an experienced worship leader and music director with extensive knowledge 
      of Christian worship music across all genres - contemporary, traditional hymns, gospel, 
      and more. You understand worship flow, congregational engagement, and how to build 
      thematic worship sets that complement sermon messages. Always suggest specific songs 
      with artists when possible, and explain your reasoning for the worship flow.`,
      messages,
    })

    return new Response(JSON.stringify({ content: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Worship API Error:", error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
