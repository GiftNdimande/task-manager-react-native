/**
 * Task-related TypeScript types and interfaces
 */

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO date string
  estimatedMinutes?: number; // Estimated time to complete in minutes
  actualMinutes?: number; // Actual time spent in minutes
  timerStartedAt?: string; // ISO date string when timer started
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  tags?: string[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  estimatedMinutes?: number;
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags?: string[];
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  searchQuery?: string;
  tags?: string[];
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}
