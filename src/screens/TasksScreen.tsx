/**
 * Tasks Screen
 * Main screen displaying all tasks with filtering and search
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import { useDebounce } from '../hooks/useDebounce';
import { TaskList } from '../components/task/TaskList';
import { Input } from '../components/common/Input';
import { CreateTaskModal } from '../components/task/CreateTaskModal';
import { EditTaskModal } from '../components/task/EditTaskModal';
import { Task, TaskStatus } from '../types/task.types';

export const TasksScreen: React.FC = () => {
  const {
    tasks,
    loading,
    stats,
    cycleTaskStatus,
    deleteTask,
    refreshTasks,
  } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter tasks based on search and status
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filter by search query
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, statusFilter, debouncedSearch]);

  const handleTaskPress = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsEditModalVisible(true);
  }, []);

  const handleCycleStatus = useCallback(async (taskId: string) => {
    try {
      await cycleTaskStatus(taskId);
    } catch (error) {
      console.error('Error cycling task status:', error);
    }
  }, [cycleTaskStatus]);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalVisible(false);
    setSelectedTask(null);
  }, []);

  const handleRefresh = useCallback(async () => {
    await refreshTasks();
  }, [refreshTasks]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {stats.completed}/{stats.total} completed
          </Text>
        </View>
      </View>

      <CreateTaskModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
      />

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('all')}
        >
          <Text style={[styles.filterText, statusFilter === 'all' && styles.filterTextActive]}>
            All ({stats.total})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, statusFilter === TaskStatus.TODO && styles.filterButtonActive]}
          onPress={() => setStatusFilter(TaskStatus.TODO)}
        >
          <Text style={[styles.filterText, statusFilter === TaskStatus.TODO && styles.filterTextActive]}>
            To Do ({stats.todo})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, statusFilter === TaskStatus.IN_PROGRESS && styles.filterButtonActive]}
          onPress={() => setStatusFilter(TaskStatus.IN_PROGRESS)}
        >
          <Text style={[styles.filterText, statusFilter === TaskStatus.IN_PROGRESS && styles.filterTextActive]}>
            In Progress ({stats.inProgress})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, statusFilter === TaskStatus.COMPLETED && styles.filterButtonActive]}
          onPress={() => setStatusFilter(TaskStatus.COMPLETED)}
        >
          <Text style={[styles.filterText, statusFilter === TaskStatus.COMPLETED && styles.filterTextActive]}>
            Done ({stats.completed})
          </Text>
        </TouchableOpacity>
      </View>

      <TaskList
        tasks={filteredTasks}
        onTaskPress={handleTaskPress}
        onCycleStatus={handleCycleStatus}
        refreshing={loading}
        onRefresh={handleRefresh}
        emptyMessage={
          searchQuery
            ? 'No tasks found matching your search'
            : statusFilter !== 'all'
            ? `No ${statusFilter.replace('_', ' ')} tasks`
            : 'No tasks yet. Create your first task!'
        }
      />

      <EditTaskModal
        visible={isEditModalVisible}
        task={selectedTask}
        onClose={handleEditModalClose}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsCreateModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});
