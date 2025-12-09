"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, BookOpen, Copy, RefreshCw } from "lucide-react"

interface VerseResult {
  citation?: string
  passage?: string
  verse?: string
  reference?: string
  error?: string
}

const BIBLE_BOOKS = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
]

const VERSIONS = [
  { value: "kjv", label: "KJV (King James)" },
  { value: "web", label: "WEB (World English)" },
  { value: "bbe", label: "BBE (Basic English)" },
  { value: "asv", label: "ASV (American Standard)" },
  { value: "ylt", label: "YLT (Young's Literal)" },
]

export function VerseLookup() {
  const [book, setBook] = useState("")
  const [chapter, setChapter] = useState("1")
  const [verses, setVerses] = useState("1")
  const [version, setVersion] = useState("kjv")
  const [result, setResult] = useState<VerseResult | null>(null)
  const [votd, setVotd] = useState<VerseResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingVotd, setIsLoadingVotd] = useState(false)

  const fetchVerse = async () => {
    if (!book) return
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        book,
        chapter,
        verses,
        version,
      })
      const response = await fetch(`/api/verse?${params}`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to fetch verse" })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchVerseOfTheDay = async () => {
    setIsLoadingVotd(true)
    try {
      const response = await fetch("/api/verse?votd=true")
      const data = await response.json()
      setVotd(data)
    } catch (error) {
      setVotd({ error: "Failed to fetch verse of the day" })
    } finally {
      setIsLoadingVotd(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Verse of the Day Card */}
      <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg text-foreground">Verse of the Day</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchVerseOfTheDay} disabled={isLoadingVotd}>
              {isLoadingVotd ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {votd ? (
            <div className="space-y-2">
              <p className="font-serif text-lg italic text-foreground leading-relaxed">
                "{votd.passage || votd.verse}"
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-primary">— {votd.citation || votd.reference}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(`"${votd.passage || votd.verse}" — ${votd.citation || votd.reference}`)
                  }
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={fetchVerseOfTheDay} disabled={isLoadingVotd}>
              {isLoadingVotd ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Get Today's Verse"
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Verse Lookup Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Scripture Lookup</CardTitle>
          <CardDescription>Search for any Bible verse</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label>Book</Label>
              <Select value={book} onValueChange={setBook}>
                <SelectTrigger>
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
                <SelectContent>
                  {BIBLE_BOOKS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Version</Label>
              <Select value={version} onValueChange={setVersion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VERSIONS.map((v) => (
                    <SelectItem key={v.value} value={v.value}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Chapter</Label>
              <Input type="number" min="1" value={chapter} onChange={(e) => setChapter(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Verse(s)</Label>
              <Input placeholder="e.g., 16 or 1-3" value={verses} onChange={(e) => setVerses(e.target.value)} />
            </div>
          </div>

          <Button className="w-full" onClick={fetchVerse} disabled={!book || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 mr-2" />
                Look Up Verse
              </>
            )}
          </Button>

          {result && (
            <div className="mt-4 p-4 rounded-lg bg-secondary">
              {result.error ? (
                <p className="text-destructive">{result.error}</p>
              ) : (
                <div className="space-y-2">
                  <p className="font-serif text-lg italic text-foreground leading-relaxed">
                    "{result.passage || result.verse}"
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary">— {result.citation || result.reference}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(`"${result.passage || result.verse}" — ${result.citation || result.reference}`)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
