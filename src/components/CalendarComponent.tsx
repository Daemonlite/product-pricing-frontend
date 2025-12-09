'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function CalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const renderCalendar = () => {
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isTodayClass = isToday(day) ? 'bg-primary text-primary-foreground' : ''
      days.push(
        <div key={day} className={`h-8 flex items-center justify-center text-sm hover:bg-card rounded cursor-pointer ${isTodayClass}`}>
          {day}
        </div>
      )
    }
    return days
  }

  return (
    <div className="p-4 border-b border-border bg-muted rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-card cursor-pointer rounded">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="p-1 hover:bg-card cursor-pointer rounded">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>
    </div>
  )
}
