import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const { text } = await generateText({
      model: google("gemini-1.5-flash-latest"),
      system: `You are a biblical scholar and theologian with expertise in:
      - Hebrew and Greek biblical languages
      - Historical and cultural context of Scripture
      - Various theological traditions and interpretations
      - Practical application of biblical principles
      
      Provide thorough, academically sound responses while remaining accessible to pastors 
      preparing sermons and Bible studies. Always cite Scripture references and explain 
      your interpretive approach when relevant. Be respectful of different denominational 
      perspectives while maintaining biblical fidelity.`,
      messages,
    })

    return new Response(JSON.stringify({ content: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Bible API Error:", error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
