"use client"

import { useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useChat } from "@ai-sdk/react"
import { Send, BookOpen, Sparkles, User, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { VerseLookup } from "./verse-lookup"

const suggestedQuestions = [
  "What is the historical context of Romans 8?",
  "Explain the meaning of 'agape' love in Greek",
  "Compare the Gospel accounts of the resurrection",
  "What are the main themes in the book of James?",
]

export function BibleAssistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/bible",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your Bible study assistant. I can help you explore Scripture, understand historical context, compare translations, and prepare for teaching. What would you like to explore today?",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const askQuestion = (question: string) => {
    setInput(question)
    setTimeout(() => {
      const form = document.getElementById("chat-form") as HTMLFormElement
      if (form) form.requestSubmit()
    }, 100)
  }

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <div className="mb-4 md:mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">Bible Assistant</h1>
        <p className="text-muted-foreground">Explore Scripture with AI-powered insights and real Bible verses</p>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit mb-4">
          <TabsTrigger value="chat" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="lookup" className="gap-2">
            <Search className="w-4 h-4" />
            Verse Lookup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 min-h-0 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            <Card className="lg:col-span-3 flex flex-col border-border">
              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-3",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground",
                        )}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="bg-secondary rounded-lg px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form id="chat-form" onSubmit={handleSubmit} className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={input || ""}
                      onChange={handleInputChange}
                      placeholder="Ask about Scripture, context, or theology..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input?.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="hidden lg:block border-border h-fit">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <CardTitle className="text-lg text-foreground">Quick Questions</CardTitle>
                </div>
                <CardDescription>Popular study topics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto py-3 px-4 bg-transparent"
                    onClick={() => askQuestion(question)}
                  >
                    <span className="text-sm leading-snug">{question}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lookup" className="flex-1 min-h-0 mt-0">
          <div className="max-w-2xl">
            <VerseLookup />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
