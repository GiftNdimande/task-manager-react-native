/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  APP_NAME: 'Task Manager',
  VERSION: '1.0.0',
  DEFAULT_TASK_PRIORITY: 'medium',
  MAX_TASK_TITLE_LENGTH: 100,
  MAX_TASK_DESCRIPTION_LENGTH: 500,
  DEBOUNCE_DELAY: 300, // milliseconds
} as const;

export const ANIMATION_DURATION = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500,
} as const;
