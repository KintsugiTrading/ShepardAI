"use client"

import { cn } from "@/lib/utils"
import type { View } from "./dashboard"
import { BookOpen, Home, Music, FileText, History, Church } from "lucide-react"

interface SidebarProps {
  currentView: View
  onNavigate: (view: View) => void
}

const navItems = [
  { id: "home" as View, label: "Dashboard", icon: Home },
  { id: "sermon" as View, label: "Sermon Builder", icon: FileText },
  { id: "worship" as View, label: "Worship Sets", icon: Music },
  { id: "bible" as View, label: "Bible Assistant", icon: BookOpen },
  { id: "history" as View, label: "History", icon: History },
]

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 h-full bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Church className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-foreground">ShepherdAI</h1>
            <p className="text-xs text-muted-foreground">Ministry Assistant</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-secondary rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">This Week</p>
          <p className="text-2xl font-semibold text-foreground">3</p>
          <p className="text-xs text-muted-foreground">Sermons Created</p>
        </div>
      </div>
    </aside>
  )
}
