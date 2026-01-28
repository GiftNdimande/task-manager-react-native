/**
 * Root Layout
 * Wraps the entire app with providers
 */

import { Stack } from 'expo-router';
import { TaskProvider } from '../src/context/TaskContext';

export default function RootLayout() {
  return (
    <TaskProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TaskProvider>
  );
}
