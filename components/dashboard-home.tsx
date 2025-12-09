"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { View } from "./dashboard"
import { FileText, Music, BookOpen, Sparkles, ArrowRight, RefreshCw, Loader2, Copy } from "lucide-react"

interface DashboardHomeProps {
  onNavigate: (view: View) => void
}

interface VerseOfTheDay {
  citation?: string
  passage?: string
  verse?: string
  reference?: string
}

const quickActions = [
  {
    id: "sermon" as View,
    title: "Create Sermon",
    description: "Generate AI-powered sermon outlines and content",
    icon: FileText,
    color: "bg-primary",
  },
  {
    id: "worship" as View,
    title: "Build Worship Set",
    description: "Create worship slides and song arrangements",
    icon: Music,
    color: "bg-accent",
  },
  {
    id: "bible" as View,
    title: "Bible Assistant",
    description: "Ask questions and explore Scripture",
    icon: BookOpen,
    color: "bg-primary",
  },
]

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const [votd, setVotd] = useState<VerseOfTheDay | null>(null)
  const [isLoadingVotd, setIsLoadingVotd] = useState(false)

  const fetchVerseOfTheDay = async () => {
    setIsLoadingVotd(true)
    try {
      const response = await fetch("/api/verse?votd=true")
      const data = await response.json()
      setVotd(data)
    } catch (error) {
      console.error("Failed to fetch VOTD:", error)
    } finally {
      setIsLoadingVotd(false)
    }
  }

  useEffect(() => {
    fetchVerseOfTheDay()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">Welcome, Pastor</h1>
        <p className="text-muted-foreground">
          Your AI-powered ministry assistant is ready to help you prepare for Sunday.
        </p>
      </div>

      <Card className="mb-8 border-border bg-gradient-to-br from-primary/10 to-accent/10">
        <CardHeader className="pb-2">
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
          {isLoadingVotd && !votd ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : votd ? (
            <div className="space-y-3">
              <p className="font-serif text-xl italic text-foreground leading-relaxed">
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
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">Unable to load verse. Click refresh to try again.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Card
              key={action.id}
              className="group cursor-pointer hover:shadow-lg transition-shadow border-border"
              onClick={() => onNavigate(action.id)}
            >
              <CardHeader>
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="flex items-center justify-between text-foreground">
                  {action.title}
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                </CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>Your latest ministry content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent activity yet. Start by creating your first sermon or worship set!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <CardTitle className="text-foreground">AI Tip of the Day</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Try using the Bible Assistant to explore cross-references and commentary on your sermon text. It can help
              you discover deeper connections and historical context that enriches your message.
            </p>
            <Button variant="link" className="px-0 mt-2 text-primary" onClick={() => onNavigate("bible")}>
              Try it now <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
