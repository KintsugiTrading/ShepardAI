"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useChat } from "@ai-sdk/react"
import { Loader2, Plus, Trash2, GripVertical, Sparkles, Music } from "lucide-react"

interface Song {
  id: string
  title: string
  artist: string
  key: string
}

export function WorshipSetCreator() {
  const [songs, setSongs] = useState<Song[]>([])
  const [newSong, setNewSong] = useState({ title: "", artist: "", key: "C" })
  const [sermonTheme, setSermonTheme] = useState("")
  const [worshipStyle, setWorshipStyle] = useState("contemporary")

  const { messages, append, isLoading } = useChat({
    api: "/api/worship",
  })

  const addSong = () => {
    if (newSong.title) {
      setSongs([...songs, { ...newSong, id: Date.now().toString() }])
      setNewSong({ title: "", artist: "", key: "C" })
    }
  }

  const removeSong = (id: string) => {
    setSongs(songs.filter((s) => s.id !== id))
  }

  const generateSuggestions = () => {
    const currentSongs = songs.map((s) => s.title).join(", ")
    const prompt = `I'm planning a ${worshipStyle} worship set for a sermon about "${sermonTheme}".
    ${currentSongs ? `I already have these songs: ${currentSongs}.` : ""}
    
    Please suggest:
    1. 4-5 songs that would fit this theme and style
    2. A recommended song order for worship flow
    3. Key transitions between songs
    4. Scripture readings that could be interspersed
    5. Any special musical moments or arrangements`

    append({ role: "user", content: prompt })
  }

  const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop()

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">Worship Set Creator</h1>
        <p className="text-muted-foreground">Build cohesive worship sets that complement your sermon</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Set Configuration</CardTitle>
              <CardDescription>Define your worship set parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sermon Theme</Label>
                <Input
                  placeholder="e.g., God's Faithfulness, Hope in Suffering"
                  value={sermonTheme}
                  onChange={(e) => setSermonTheme(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Worship Style</Label>
                <Select value={worshipStyle} onValueChange={setWorshipStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contemporary">Contemporary</SelectItem>
                    <SelectItem value="traditional">Traditional Hymns</SelectItem>
                    <SelectItem value="blended">Blended</SelectItem>
                    <SelectItem value="gospel">Gospel</SelectItem>
                    <SelectItem value="acoustic">Acoustic/Intimate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Song List</CardTitle>
              <CardDescription>Add songs to your worship set</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="Song title"
                  value={newSong.title}
                  onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                  className="col-span-1"
                />
                <Input
                  placeholder="Artist"
                  value={newSong.artist}
                  onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                />
                <div className="flex gap-2">
                  <Select value={newSong.key} onValueChange={(v) => setNewSong({ ...newSong, key: v })}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["C", "D", "E", "F", "G", "A", "B"].map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addSong} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {songs.length > 0 ? (
                <div className="space-y-2">
                  {songs.map((song, index) => (
                    <div key={song.id} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{song.title}</p>
                        <p className="text-sm text-muted-foreground">{song.artist}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">Key: {song.key}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeSong(song.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground text-sm">
                  No songs added yet. Add songs or generate suggestions below.
                </p>
              )}

              <Button className="w-full" onClick={generateSuggestions} disabled={!sermonTheme || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Suggestions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-accent" />
              <CardTitle className="text-foreground">AI Suggestions</CardTitle>
            </div>
            <CardDescription>Song recommendations and worship flow</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Finding the perfect songs...</p>
              </div>
            ) : lastAssistantMessage ? (
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">{lastAssistantMessage.content}</div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Enter a sermon theme and click "Get AI Suggestions" for worship set recommendations.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
