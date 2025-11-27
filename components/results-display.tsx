"use client"

import type { TypingStats } from "./typing-tester"

interface ResultsDisplayProps {
  stats: TypingStats
  onReset: () => void
  textMode?: "same" | "different"
  onTextModeChange?: (mode: "same" | "different") => void
}

export default function ResultsDisplay({
  stats,
  onReset,
  textMode = "different",
  onTextModeChange,
}: ResultsDisplayProps) {
  const getPerformanceColor = (accuracy: number) => {
    if (accuracy >= 98) return "text-success"
    if (accuracy >= 95) return "text-primary"
    if (accuracy >= 90) return "text-warning"
    return "text-destructive"
  }

  const incorrectWordsCount = stats.wordAccuracies?.filter((w) => !w.isCorrect).length || 0

  const handleTryAgain = () => {
    if (textMode === "same") {
      onReset()
    } else {
      onReset()
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-card border border-border rounded-lg p-8 md:p-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">Great Job!</h2>
          <p className="text-muted-foreground">Here's how you performed</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="WPM" value={stats.wpm} unit="words/min" highlight />
          <StatCard label="Accuracy" value={stats.accuracy} unit="%" className={getPerformanceColor(stats.accuracy)} />
          <StatCard label="Time" value={stats.timeElapsed} unit="seconds" />
          <StatCard label="Errors" value={stats.totalErrors || 0} unit="mistakes" />
        </div>

        <div className="bg-muted/50 rounded-lg p-6 space-y-3">
          <h3 className="font-semibold text-foreground">Performance Metrics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Accuracy Rate</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.accuracy}%` }}
                  />
                </div>
                <span className="font-medium text-foreground">{stats.accuracy}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Typed vs Correct</span>
              <span className="font-medium text-foreground">
                {stats.correctCharacters} / {stats.charactersTyped}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Incorrect Words</span>
              <span className={`font-medium ${incorrectWordsCount > 0 ? "text-destructive" : "text-success"}`}>
                {incorrectWordsCount} word{incorrectWordsCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {stats.wordAccuracies && stats.wordAccuracies.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-foreground">Word-by-Word Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {stats.wordAccuracies.map((wordData, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border transition-colors ${
                    wordData.isCorrect ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground break-words">
                        Expected: <span className="font-mono">{wordData.word}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 break-words">
                        Typed: <span className="font-mono">{wordData.typed || "(empty)"}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-sm font-semibold ${wordData.isCorrect ? "text-success" : "text-destructive"}`}
                      >
                        {wordData.accuracy}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground font-medium">Next attempt:</p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => {
                onTextModeChange?.("same")
                handleTryAgain()
              }}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all text-base ${
                textMode === "same"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-border hover:bg-muted/80"
              }`}
            >
              Same Text
            </button>
            <button
              onClick={() => {
                onTextModeChange?.("different")
                handleTryAgain()
              }}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all text-base ${
                textMode === "different"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-border hover:bg-muted/80"
              }`}
            >
              Different Text
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  unit: string
  highlight?: boolean
  className?: string
}

function StatCard({ label, value, unit, highlight, className }: StatCardProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 text-center space-y-1">
      <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">{label}</p>
      <p
        className={`text-2xl md:text-3xl font-bold ${highlight ? "text-primary" : ""} ${className || "text-foreground"}`}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{unit}</p>
    </div>
  )
}
