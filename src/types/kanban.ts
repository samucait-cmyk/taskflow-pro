export interface Subtask {
  text: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  tag: string
  dueDate?: string
  checklist?: Subtask[]
}

export interface Column {
  id: string
  title: string
}