"use client"

import { useState, useEffect } from "react"
import TypingTester from "@/components/typing-tester"
import ThemeSwitcher from "@/components/theme-switcher"

export default function Home() {
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    document.documentElement.classList.remove(
      "dark",
      "theme-ocean",
      "theme-sunset",
      "theme-forest",
      "theme-neon",
      "theme-minimal",
    )

    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.add(`theme-${theme}`)
    }
  }, [theme])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="flex justify-between items-center px-4 py-6 md:px-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <h1 className="text-2xl font-bold tracking-tight">TypeSpeed</h1>
        </div>
        <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <TypingTester />
      </div>
    </main>
  )
}
