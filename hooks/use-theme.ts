"use client"

import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"
    setTheme(savedTheme)
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  return { theme }
}
