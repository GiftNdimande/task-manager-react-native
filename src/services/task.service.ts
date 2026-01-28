/**
 * Task service for CRUD operations
 * Handles all task-related business logic and data persistence
 */

import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from '../types/task.types';
import StorageService from './storage.service';
import { STORAGE_KEYS } from '../constants/storage';

class TaskService {
  /**
   * Generate a unique ID for a task
   */
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all tasks from storage
   */
  async getAllTasks(): Promise<Task[]> {
    try {
      const tasks = await StorageService.getItem<Task[]>(STORAGE_KEYS.TASKS);
      return tasks || [];
    } catch (error) {
      console.error('Error getting all tasks:', error);
      throw error;
    }
  }

  /**
   * Get a single task by ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    try {
      const tasks = await this.getAllTasks();
      return tasks.find(task => task.id === id) || null;
    } catch (error) {
      console.error('Error getting task by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new task
   */
  async createTask(input: CreateTaskInput): Promise<Task> {
    try {
      const tasks = await this.getAllTasks();
      
      const newTask: Task = {
        id: this.generateId(),
        title: input.title,
        description: input.description,
        status: TaskStatus.TODO,
        priority: input.priority || TaskPriority.MEDIUM,
        dueDate: input.dueDate,
        tags: input.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedTasks = [...tasks, newTask];
      await StorageService.setItem(STORAGE_KEYS.TASKS, updatedTasks);
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    try {
      const tasks = await this.getAllTasks();
      const taskIndex = tasks.findIndex(task => task.id === id);

      if (taskIndex === -1) {
        throw new Error(`Task with ID ${id} not found`);
      }

      const updatedTask: Task = {
        ...tasks[taskIndex],
        ...input,
        updatedAt: new Date().toISOString(),
      };

      tasks[taskIndex] = updatedTask;
      await StorageService.setItem(STORAGE_KEYS.TASKS, tasks);
      
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    try {
      const tasks = await this.getAllTasks();
      const filteredTasks = tasks.filter(task => task.id !== id);
      
      if (filteredTasks.length === tasks.length) {
        throw new Error(`Task with ID ${id} not found`);
      }

      await StorageService.setItem(STORAGE_KEYS.TASKS, filteredTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  /**
   * Toggle task completion status
   */
  async toggleTaskStatus(id: string): Promise<Task> {
    try {
      const task = await this.getTaskById(id);
      
      if (!task) {
        throw new Error(`Task with ID ${id} not found`);
      }

      const newStatus = task.status === TaskStatus.COMPLETED 
        ? TaskStatus.TODO 
        : TaskStatus.COMPLETED;

      return await this.updateTask(id, { status: newStatus });
    } catch (error) {
      console.error('Error toggling task status:', error);
      throw error;
    }
  }

  /**
   * Cycle task status through TODO → IN_PROGRESS → COMPLETED → TODO
   */
  async cycleTaskStatus(id: string): Promise<Task> {
    try {
      const task = await this.getTaskById(id);
      
      if (!task) {
        throw new Error(`Task with ID ${id} not found`);
      }

      let newStatus: TaskStatus;
      switch (task.status) {
        case TaskStatus.TODO:
          newStatus = TaskStatus.IN_PROGRESS;
          break;
        case TaskStatus.IN_PROGRESS:
          newStatus = TaskStatus.COMPLETED;
          break;
        case TaskStatus.COMPLETED:
          newStatus = TaskStatus.TODO;
          break;
        default:
          newStatus = TaskStatus.TODO;
      }

      return await this.updateTask(id, { status: newStatus });
    } catch (error) {
      console.error('Error cycling task status:', error);
      throw error;
    }
  }

  /**
   * Get tasks by status
   */
  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    try {
      const tasks = await this.getAllTasks();
      return tasks.filter(task => task.status === status);
    } catch (error) {
      console.error('Error getting tasks by status:', error);
      throw error;
    }
  }

  /**
   * Get tasks by priority
   */
  async getTasksByPriority(priority: TaskPriority): Promise<Task[]> {
    try {
      const tasks = await this.getAllTasks();
      return tasks.filter(task => task.priority === priority);
    } catch (error) {
      console.error('Error getting tasks by priority:', error);
      throw error;
    }
  }

  /**
   * Search tasks by title or description
   */
  async searchTasks(query: string): Promise<Task[]> {
    try {
      const tasks = await this.getAllTasks();
      const lowerQuery = query.toLowerCase();
      
      return tasks.filter(task => 
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }
  }

  /**
   * Clear all tasks
   */
  async clearAllTasks(): Promise<void> {
    try {
      await StorageService.setItem(STORAGE_KEYS.TASKS, []);
    } catch (error) {
      console.error('Error clearing all tasks:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new TaskService();
