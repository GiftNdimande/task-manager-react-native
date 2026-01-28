/**
 * Task Context Provider
 * Manages global task state and provides task operations to the app
 */

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, TaskFilters, TaskStats, TaskStatus } from '../types/task.types';
import TaskService from '../services/task.service';

interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
  stats: TaskStats;
  
  // Task operations
  loadTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  cycleTaskStatus: (id: string) => Promise<void>;
  
  // Filter operations
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  
  // Utility operations
  getFilteredTasks: () => Task[];
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<TaskFilters>({});

  /**
   * Calculate task statistics
   */
  const calculateStats = useCallback((taskList: Task[]): TaskStats => {
    return {
      total: taskList.length,
      completed: taskList.filter(t => t.status === TaskStatus.COMPLETED).length,
      inProgress: taskList.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      todo: taskList.filter(t => t.status === TaskStatus.TODO).length,
    };
  }, []);

  const stats = calculateStats(tasks);

  /**
   * Load all tasks from storage
   */
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedTasks = await TaskService.getAllTasks();
      setTasks(loadedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMessage);
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new task
   */
  const createTask = useCallback(async (input: CreateTaskInput): Promise<Task> => {
    try {
      setError(null);
      const newTask = await TaskService.createTask(input);
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Update an existing task
   */
  const updateTask = useCallback(async (id: string, input: UpdateTaskInput): Promise<Task> => {
    try {
      setError(null);
      const updatedTask = await TaskService.updateTask(id, input);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Delete a task
   */
  const deleteTask = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await TaskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Toggle task completion status
   */
  const toggleTaskStatus = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      const updatedTask = await TaskService.toggleTaskStatus(id);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle task status';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Cycle task status through TODO → IN_PROGRESS → COMPLETED → TODO
   */
  const cycleTaskStatus = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      const updatedTask = await TaskService.cycleTaskStatus(id);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cycle task status';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Set filters
   */
  const setFilters = useCallback((newFilters: TaskFilters) => {
    setFiltersState(newFilters);
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  /**
   * Get filtered tasks based on current filters
   */
  const getFilteredTasks = useCallback((): Task[] => {
    let filtered = [...tasks];

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Filter by priority
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(task =>
        task.tags?.some(tag => filters.tags?.includes(tag))
      );
    }

    return filtered;
  }, [tasks, filters]);

  /**
   * Refresh tasks (reload from storage)
   */
  const refreshTasks = useCallback(async () => {
    await loadTasks();
  }, [loadTasks]);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const value: TaskContextValue = {
    tasks,
    loading,
    error,
    filters,
    stats,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    cycleTaskStatus,
    setFilters,
    clearFilters,
    getFilteredTasks,
    refreshTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export default TaskContext;
