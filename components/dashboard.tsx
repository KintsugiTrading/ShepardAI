"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { DashboardHome } from "./dashboard-home"
import { SermonBuilder } from "./sermon-builder"
import { WorshipSetCreator } from "./worship-set-creator"
import { BibleAssistant } from "./bible-assistant"
import { HistoryView } from "./history-view"
import { Menu, X } from "lucide-react"

export type View = "home" | "sermon" | "worship" | "bible" | "history"

export function Dashboard() {
  const [currentView, setCurrentView] = useState<View>("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleNavigate = (view: View) => {
    setCurrentView(view)
    setSidebarOpen(false) // Close sidebar on mobile after navigation
  }

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <DashboardHome onNavigate={handleNavigate} />
      case "sermon":
        return <SermonBuilder />
      case "worship":
        return <WorshipSetCreator />
      case "bible":
        return <BibleAssistant />
      case "history":
        return <HistoryView />
      default:
        return <DashboardHome onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
        <h1 className="font-serif text-lg font-semibold text-foreground">ShepherdAI</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile, shown via overlay when open */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      </div>

      {/* Main Content - add top padding on mobile for header */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0">{renderView()}</main>
    </div>
  )
}
