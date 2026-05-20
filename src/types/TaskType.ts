export type TaskStatus = 'todo' | 'doing' | 'done'

export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  assignee: {
    name: string
    avatar: string
  }
  createdAt: Date
  updatedAt: Date
  tags: string[]
  progress: number
  description: string
}

export interface Column {
  id: TaskStatus
  title: string
  tasks: Task[]
  wipLimit?: number
}
