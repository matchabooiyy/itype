"use client"

import { useState, useEffect, useRef, forwardRef } from "react"
import type { TypingStats, WordAccuracy } from "./typing-tester"
import LiveTracker from "./live-tracker"

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog and dives into the swift waters of the river.",
  "Mastering typing is a skill that improves with consistent practice and dedication to the craft.",
  "Technology evolves rapidly, and staying updated with the latest innovations is essential today.",
  "Every keystroke brings you closer to becoming a proficient typist with muscle memory.",
  "Precision and speed go hand in hand when developing professional typing abilities.",
  "Innovation drives progress forward, and continuous learning shapes our digital tomorrow.",
  "Patience and persistence are the foundations of mastery in any skill you pursue.",
  "The journey of a thousand words begins with a single keystroke of determination.",
]

interface TypingAreaProps {
  onTestStart: () => void
  onTestComplete: (stats: TypingStats & { wordAccuracies: WordAccuracy[] }) => void
  onStatsUpdate: (stats: Partial<TypingStats>) => void
  textMode?: "same" | "different"
}

const TypingArea = forwardRef<HTMLInputElement, TypingAreaProps>(
  ({ onTestStart, onTestComplete, onStatsUpdate, textMode = "different" }, ref) => {
    const [input, setInput] = useState("")
    const [textIndex, setTextIndex] = useState(0)
    const [startTime, setStartTime] = useState<number | null>(null)
    const [testActive, setTestActive] = useState(false)
    const [errorCount, setErrorCount] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const currentText = SAMPLE_TEXTS[textIndex]
    const words = currentText.split(" ")

    const calculateWordAccuracies = (text: string, inputText: string): WordAccuracy[] => {
      const textWords = text.split(" ")
      const inputWords = inputText.split(" ")

      return textWords.map((word, index) => {
        const typedWord = inputWords[index] || ""
        const isCorrect = typedWord === word

        let accuracy = 0
        if (typedWord.length === 0) {
          accuracy = 0
        } else if (isCorrect) {
          accuracy = 100
        } else {
          const matchingChars = word.split("").filter((char, i) => char === typedWord[i]).length
          accuracy = Math.round((matchingChars / Math.max(word.length, typedWord.length)) * 100)
        }

        return {
          word,
          typed: typedWord,
          accuracy,
          isCorrect,
        }
      })
    }

    useEffect(() => {
      if (!testActive) return

      timerRef.current = setInterval(() => {
        if (startTime) {
          const elapsed = (Date.now() - startTime) / 1000
          const minutes = elapsed / 60
          const wpm = Math.max(0, Math.round(input.length / 5 / minutes))

          let correctChars = 0
          let errors = 0
          for (let i = 0; i < input.length; i++) {
            if (i < currentText.length && input[i] === currentText[i]) {
              correctChars++
            } else if (i < currentText.length) {
              errors++
            }
          }
          if (input.length > currentText.length) {
            errors += input.length - currentText.length
          }
          setErrorCount(errors)

          const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100

          onStatsUpdate({
            wpm,
            accuracy,
            charactersTyped: input.length,
            correctCharacters: correctChars,
            timeElapsed: Math.round(elapsed),
            totalErrors: errors,
          })

          if (input === currentText) {
            completeTest(wpm, accuracy, correctChars, errors)
          }
        }
      }, 100)

      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }, [testActive, input, startTime, currentText, onStatsUpdate])

    const completeTest = (wpm: number, accuracy: number, correctChars: number, errors: number) => {
      setTestActive(false)
      const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0
      const wordAccuracies = calculateWordAccuracies(currentText, input)

      onTestComplete({
        wpm,
        accuracy,
        charactersTyped: input.length,
        correctCharacters: correctChars,
        timeElapsed: Math.round(elapsed),
        testActive: false,
        wordAccuracies,
        totalErrors: errors,
      })
    }

    const handleInputChange = (e: string) => {
      if (!testActive && e.length > 0) {
        setTestActive(true)
        onTestStart()
        setStartTime(Date.now())
      }

      if (e.length <= currentText.length) {
        setInput(e)
      }
    }

    const handleReset = (getNewText = true) => {
      if (timerRef.current) clearInterval(timerRef.current)
      setInput("")
      setTestActive(false)
      setStartTime(null)
      setErrorCount(0)

      if (getNewText) {
        setTextIndex((prev) => (prev + 1) % SAMPLE_TEXTS.length)
      }
    }

    const renderText = () => {
      return currentText.split("").map((char, charIndex) => {
        let charClass = "char-untyped"
        if (charIndex < input.length) {
          charClass = input[charIndex] === char ? "char-correct" : "char-incorrect"
        } else if (charIndex === input.length) {
          charClass = "char-current"
        }

        return (
          <span key={charIndex} className={`char-container ${charClass} ${char === " " ? "mx-1" : ""}`}>
            {char === " " ? "\u00A0" : char}
          </span>
        )
      })
    }

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {testActive && (
          <div className="animate-in fade-in duration-300">
            <LiveTracker
              timeElapsed={Math.round((Date.now() - (startTime || Date.now())) / 1000)}
              errors={errorCount}
              wpm={0}
              accuracy={100}
              isActive={testActive}
            />
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-8 md:p-12 space-y-6">
          <div className="typing-text min-h-[120px] flex items-center justify-center leading-loose flex-wrap">
            {renderText()}
          </div>

          <input
            ref={ref}
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card transition-all"
            placeholder="Start typing here..."
            disabled={input === currentText}
            autoFocus
          />

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">{testActive ? "Typing..." : "Click to start"}</div>
            <button
              onClick={() => handleReset(true)}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
            >
              New Text
            </button>
          </div>
        </div>
      </div>
    )
  },
)

TypingArea.displayName = "TypingArea"

export default TypingArea
