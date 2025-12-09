import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4-20250514",
    system: `You are an expert sermon writer and theologian with deep knowledge of Scripture, 
    homiletics, and pastoral ministry. You help pastors create biblically sound, engaging, 
    and practical sermons. Always include Scripture references, real-world applications, 
    and discussion questions. Format your responses with clear headings and structure.`,
    messages,
  })

  return result.toUIMessageStreamResponse()
}
