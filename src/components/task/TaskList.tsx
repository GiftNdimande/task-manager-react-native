/**
 * Task List Component
 * Displays a list of tasks with empty state
 */

import React from 'react';
import { FlatList, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { Task } from '../../types/task.types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onTaskPress?: (task: Task) => void;
  onToggleStatus?: (taskId: string) => void;
  onCycleStatus?: (taskId: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskPress,
  onToggleStatus,
  onCycleStatus,
  refreshing = false,
  onRefresh,
  emptyMessage = 'No tasks found',
}) => {
  const renderItem = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onPress={onTaskPress}
      onToggleStatus={onToggleStatus}
      onCycleStatus={onCycleStatus}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.listContent,
        tasks.length === 0 && styles.emptyListContent,
      ]}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
