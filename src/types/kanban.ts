export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  priority: Priority;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  wipLimit?: number;
}

export type Theme = 'light' | 'dark' | 'dracula' | 'nord';