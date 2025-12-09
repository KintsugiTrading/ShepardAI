import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `You are an expert sermon writer and theologian with deep knowledge of Scripture, 
      homiletics, and pastoral ministry. You help pastors create biblically sound, engaging, 
      and practical sermons. Always include Scripture references, real-world applications, 
      and discussion questions. Format your responses with clear headings and structure.`,
      messages,
    })

    return new Response(JSON.stringify({ content: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Sermon API Error:", error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
