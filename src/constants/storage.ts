/**
 * AsyncStorage keys used throughout the application
 */

export const STORAGE_KEYS = {
  TASKS: '@task_manager:tasks',
  USER_PREFERENCES: '@task_manager:preferences',
  THEME: '@task_manager:theme',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
