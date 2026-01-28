/**
 * Validation utility functions
 */

import { APP_CONFIG } from '../constants/config';

export const validateTaskTitle = (title: string): string | null => {
  if (!title || title.trim().length === 0) {
    return 'Title is required';
  }
  
  if (title.length > APP_CONFIG.MAX_TASK_TITLE_LENGTH) {
    return `Title must be less than ${APP_CONFIG.MAX_TASK_TITLE_LENGTH} characters`;
  }
  
  return null;
};

export const validateTaskDescription = (description?: string): string | null => {
  if (!description) return null;
  
  if (description.length > APP_CONFIG.MAX_TASK_DESCRIPTION_LENGTH) {
    return `Description must be less than ${APP_CONFIG.MAX_TASK_DESCRIPTION_LENGTH} characters`;
  }
  
  return null;
};

export const validateDueDate = (dueDate?: string): string | null => {
  if (!dueDate) return null;
  
  const date = new Date(dueDate);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }
  
  return null;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};
