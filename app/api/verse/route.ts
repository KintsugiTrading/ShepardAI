import { NextResponse } from "next/server"

// instead of @glowstudent/youversion which uses web scraping

const BIBLE_API_BASE = "https://bible-api.com"

// Curated list of inspiring verses for verse of the day
const VOTD_VERSES = [
  "John 3:16",
  "Jeremiah 29:11",
  "Philippians 4:13",
  "Romans 8:28",
  "Proverbs 3:5-6",
  "Isaiah 41:10",
  "Psalm 23:1-3",
  "Matthew 11:28-30",
  "Joshua 1:9",
  "Psalm 46:1",
  "Romans 12:2",
  "Galatians 5:22-23",
  "Ephesians 2:8-9",
  "2 Timothy 1:7",
  "1 Corinthians 10:13",
  "Psalm 119:105",
  "Hebrews 11:1",
  "James 1:5",
  "1 Peter 5:7",
  "Psalm 27:1",
  "Isaiah 40:31",
  "Deuteronomy 31:6",
  "Matthew 6:33",
  "Colossians 3:23",
  "Psalm 37:4",
  "Romans 15:13",
  "2 Corinthians 5:17",
  "Philippians 4:6-7",
  "Psalm 91:1-2",
  "John 14:6",
]

function getVerseOfTheDayReference(): string {
  // Use the day of the year to rotate through verses
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  return VOTD_VERSES[dayOfYear % VOTD_VERSES.length]
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const book = searchParams.get("book")
  const chapter = searchParams.get("chapter")
  const verses = searchParams.get("verses")
  const version = searchParams.get("version")?.toLowerCase() || "kjv"
  const votd = searchParams.get("votd")

  try {
    // Get verse of the day
    if (votd === "true") {
      const reference = getVerseOfTheDayReference()
      const response = await fetch(`${BIBLE_API_BASE}/${encodeURIComponent(reference)}?translation=${version}`)

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json({
        citation: data.reference,
        passage: data.text?.trim(),
        reference: data.reference,
        translation: data.translation_name,
      })
    }

    // Get specific verse
    if (book) {
      let reference = book
      if (chapter) {
        reference += ` ${chapter}`
        if (verses) {
          reference += `:${verses}`
        }
      }

      const response = await fetch(`${BIBLE_API_BASE}/${encodeURIComponent(reference)}?translation=${version}`)

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json({
        citation: data.reference,
        passage: data.text?.trim(),
        reference: data.reference,
        translation: data.translation_name,
        verses: data.verses,
      })
    }

    return NextResponse.json({ error: "Missing book parameter" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching verse:", error)
    return NextResponse.json({ error: "Failed to fetch verse" }, { status: 500 })
  }
}
