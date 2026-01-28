/**
 * Custom hook for debouncing values
 * Useful for search inputs and other frequently changing values
 */

import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../constants/config';

export const useDebounce = <T>(value: T, delay: number = APP_CONFIG.DEBOUNCE_DELAY): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
