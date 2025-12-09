"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Copy, Download, Sparkles } from "lucide-react"

export function SermonBuilder() {
  const [sermonType, setSermonType] = useState("expository")
  const [scripture, setScripture] = useState("")
  const [theme, setTheme] = useState("")
  const [audience, setAudience] = useState("general")
  const [duration, setDuration] = useState("30")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedSermon, setGeneratedSermon] = useState("")
  const [error, setError] = useState("")

  const generateSermon = async () => {
    if (!scripture.trim()) return

    setIsLoading(true)
    setError("")
    setGeneratedSermon("")

    const prompt = `Generate a ${duration}-minute ${sermonType} sermon outline based on ${scripture}. 
    Theme: ${theme || "Let the Scripture guide the theme"}
    Target audience: ${audience}
    
    Please include:
    1. A compelling title
    2. Introduction with hook
    3. 3-4 main points with Scripture references
    4. Illustrations and applications for each point
    5. Conclusion with call to action
    6. Discussion questions for small groups`

    try {
      const response = await fetch("/api/sermon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }]
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate sermon")
      }

      setGeneratedSermon(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate sermon. Please try again.")
      console.error("Sermon generation error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">Sermon Builder</h1>
        <p className="text-muted-foreground">Create powerful, Scripture-based sermons with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Sermon Details</CardTitle>
            <CardDescription>Configure your sermon parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="scripture">Scripture Passage</Label>
              <Input
                id="scripture"
                placeholder="e.g., John 3:16-21, Romans 8:28"
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Theme or Topic (Optional)</Label>
              <Input
                id="theme"
                placeholder="e.g., God's Grace, Faith in Trials"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sermon Type</Label>
                <Select value={sermonType} onValueChange={setSermonType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expository">Expository</SelectItem>
                    <SelectItem value="topical">Topical</SelectItem>
                    <SelectItem value="narrative">Narrative</SelectItem>
                    <SelectItem value="textual">Textual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="20">20 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Congregation</SelectItem>
                  <SelectItem value="youth">Youth Group</SelectItem>
                  <SelectItem value="men">Men&apos;s Ministry</SelectItem>
                  <SelectItem value="women">Women&apos;s Ministry</SelectItem>
                  <SelectItem value="seekers">Seekers/New Believers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={generateSermon} disabled={!scripture.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Sermon Outline
                </>
              )}
            </Button>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Generated Sermon</CardTitle>
                <CardDescription>Your AI-generated sermon outline</CardDescription>
              </div>
              {generatedSermon && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedSermon)}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Crafting your sermon...</p>
              </div>
            ) : generatedSermon ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {generatedSermon}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Enter your sermon details and click generate to create your outline.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
