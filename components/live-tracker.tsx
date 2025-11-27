"use client"

interface LiveTrackerProps {
  timeElapsed: number
  errors: number
  wpm: number
  accuracy: number
  isActive: boolean
}

export default function LiveTracker({ timeElapsed, errors, wpm, accuracy, isActive }: LiveTrackerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-muted/50 rounded-lg p-4 text-center space-y-1 border border-border">
        <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide font-medium">Time</p>
        <p className="text-xl md:text-2xl font-bold text-foreground font-mono">{formatTime(timeElapsed)}</p>
      </div>

      <div
        className={`bg-muted/50 rounded-lg p-4 text-center space-y-1 border ${errors > 0 ? "border-destructive/50 bg-destructive/5" : "border-border"}`}
      >
        <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide font-medium">Errors</p>
        <p className={`text-xl md:text-2xl font-bold font-mono ${errors > 0 ? "text-destructive" : "text-foreground"}`}>
          {errors}
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-center space-y-1 border border-border">
        <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide font-medium">WPM</p>
        <p className="text-xl md:text-2xl font-bold text-primary font-mono">{wpm}</p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-center space-y-1 border border-border">
        <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide font-medium">Accuracy</p>
        <p className="text-xl md:text-2xl font-bold text-foreground font-mono">{accuracy}%</p>
      </div>
    </div>
  )
}
