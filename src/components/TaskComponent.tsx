'use client'

import { useState } from 'react'
import { CheckSquare, Square, Plus } from 'lucide-react'
import Input from './ui/Input-field'
import { Button } from './ui/button'

interface Task {
  id: number
  text: string
  completed: boolean
}

export function TaskComponent() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Review pricing strategy', completed: false },
    { id: 2, text: 'Update competitor data', completed: true },
    { id: 3, text: 'Prepare monthly report', completed: false },
  ])
  const [newTaskText, setNewTaskText] = useState('')

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: newTaskText.trim(),
        completed: false,
      }
      setTasks([...tasks, newTask])
      setNewTaskText('')
    }
  }

  return (
    <div className="p-4">
      <h4 className="font-semibold mb-3">Tasks</h4>
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center space-x-2">
            <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
              {task.completed ? (
                <CheckSquare className="w-5 h-5 text-primary" />
              ) : (
                <Square className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <span className={`text-base ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center space-x-2 mb-6">
        <Input
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add new task..."
          variant='filled'
        />
        <Button onClick={addTask} className="flex-shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
