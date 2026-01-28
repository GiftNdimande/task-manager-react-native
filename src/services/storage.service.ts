/**
 * Storage service for AsyncStorage operations
 * Provides a type-safe wrapper around AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '../constants/storage';

class StorageService {
  /**
   * Store data in AsyncStorage
   */
  async setItem<T>(key: StorageKey, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
      throw new Error(`Failed to store data: ${error}`);
    }
  }

  /**
   * Retrieve data from AsyncStorage
   */
  async getItem<T>(key: StorageKey): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      throw new Error(`Failed to retrieve data: ${error}`);
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  async removeItem(key: StorageKey): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw new Error(`Failed to remove data: ${error}`);
    }
  }

  /**
   * Clear all data from AsyncStorage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      throw new Error(`Failed to clear storage: ${error}`);
    }
  }

  /**
   * Get all keys from AsyncStorage
   */
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      throw new Error(`Failed to get keys: ${error}`);
    }
  }

  /**
   * Merge data with existing data in AsyncStorage
   */
  async mergeItem<T>(key: StorageKey, value: Partial<T>): Promise<void> {
    try {
      const existing = await this.getItem<T>(key);
      const merged = { ...existing, ...value };
      await this.setItem(key, merged);
    } catch (error) {
      console.error(`Error merging data for key ${key}:`, error);
      throw new Error(`Failed to merge data: ${error}`);
    }
  }
}

// Export singleton instance
export default new StorageService();
