"use client"

import { useState, useEffect, useRef } from "react"
import TypingArea from "./typing-area"
import ResultsDisplay from "./results-display"

export interface WordAccuracy {
  word: string
  typed: string
  accuracy: number
  isCorrect: boolean
}

export interface TypingStats {
  wpm: number
  accuracy: number
  charactersTyped: number
  correctCharacters: number
  timeElapsed: number
  testActive: boolean
  wordAccuracies?: WordAccuracy[]
  totalErrors?: number
}

export default function TypingTester() {
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    charactersTyped: 0,
    correctCharacters: 0,
    timeElapsed: 0,
    testActive: false,
    wordAccuracies: [],
    totalErrors: 0,
  })

  const [showResults, setShowResults] = useState(false)
  const [textMode, setTextMode] = useState<"same" | "different">("different")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [showResults])

  const handleTestStart = () => {
    setShowResults(false)
    setStats({
      wpm: 0,
      accuracy: 100,
      charactersTyped: 0,
      correctCharacters: 0,
      timeElapsed: 0,
      testActive: true,
      wordAccuracies: [],
      totalErrors: 0,
    })
  }

  const handleTestComplete = (finalStats: TypingStats) => {
    setStats(finalStats)
    setShowResults(true)
  }

  const handleStatsUpdate = (newStats: Partial<TypingStats>) => {
    setStats((prev) => ({ ...prev, ...newStats }))
  }

  return (
    <div className="w-full max-w-4xl">
      {showResults ? (
        <ResultsDisplay stats={stats} onReset={handleTestStart} textMode={textMode} onTextModeChange={setTextMode} />
      ) : (
        <TypingArea
          ref={inputRef}
          onTestStart={handleTestStart}
          onTestComplete={handleTestComplete}
          onStatsUpdate={handleStatsUpdate}
          textMode={textMode}
        />
      )}
    </div>
  )
}
