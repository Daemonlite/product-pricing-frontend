'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        aria-label="Toggle Dark Mode"
        type="button"
        className=""
      >
        <Moon className="w-5 h-5 animate-spin" />
      </button>
    )
  }

  return (
    <button
        aria-label="Toggle Dark Mode"
        type="button"
        className="p-2transition-colors cursor-pointer"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
        {theme === 'dark' ? <Sun className="w-5 h-5 hover:text-primary animate-spin" /> : <Moon className="w-5 h-5 hover:text-primary animate-spin" />}
    </button>
  )
}