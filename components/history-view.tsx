"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Music, BookOpen, Calendar } from "lucide-react"

export function HistoryView() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">History</h1>
        <p className="text-muted-foreground">View and manage your past sermons, worship sets, and Bible studies</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sermons">Sermons</TabsTrigger>
          <TabsTrigger value="worship">Worship Sets</TabsTrigger>
          <TabsTrigger value="bible">Bible Studies</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No History Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your generated sermons, worship sets, and Bible study sessions will appear here. Start creating
                  content to build your ministry library!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sermons" className="mt-6">
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Sermons Yet</h3>
                <p className="text-muted-foreground">Generated sermons will be saved here for future reference.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="worship" className="mt-6">
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Worship Sets Yet</h3>
                <p className="text-muted-foreground">Your worship set plans will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bible" className="mt-6">
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Bible Studies Yet</h3>
                <p className="text-muted-foreground">Your Bible study conversations will be saved here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
