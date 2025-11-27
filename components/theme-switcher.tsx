"use client"

interface ThemeSwitcherProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
}

const themes = [
  { id: "dark", label: "Dark", icon: "🌙" },
  { id: "light", label: "Light", icon: "☀️" },
  { id: "ocean", label: "Ocean", icon: "🌊" },
  { id: "sunset", label: "Sunset", icon: "🌅" },
  { id: "forest", label: "Forest", icon: "🌲" },
  { id: "neon", label: "Neon", icon: "⚡" },
  { id: "minimal", label: "Minimal", icon: "◻️" },
]

export default function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-2 flex-wrap justify-end">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => onThemeChange(t.id)}
          className={`theme-btn transition-all ${currentTheme === t.id ? "theme-btn-active" : "theme-btn-inactive"}`}
          title={t.label}
        >
          <span className="text-base">{t.icon}</span>
        </button>
      ))}
    </div>
  )
}
