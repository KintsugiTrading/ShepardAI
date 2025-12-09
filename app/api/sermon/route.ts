import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      system: `You are an expert sermon writer and theologian with deep knowledge of Scripture, 
      homiletics, and pastoral ministry. You help pastors create biblically sound, engaging, 
      and practical sermons. Always include Scripture references, real-world applications, 
      and discussion questions. Format your responses with clear headings and structure.`,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Sermon API Error:", error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
