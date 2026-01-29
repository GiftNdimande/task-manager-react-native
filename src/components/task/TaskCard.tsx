/**
 * Task Card Component
 * Displays a single task with its details
 */

import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task, TaskPriority, TaskStatus } from '../../types/task.types';
import { formatDueDate, isOverdue } from '../../utils/date.utils';

interface TaskCardProps {
  task: Task;
  onPress?: (task: Task) => void;
  onToggleStatus?: (taskId: string) => void;
  onCycleStatus?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggleStatus,
  onCycleStatus,
}) => {
  const handlePress = useCallback(() => {
    onPress?.(task);
  }, [task, onPress]);

  const handleToggle = useCallback(() => {
    // Use cycle status if available, otherwise fall back to toggle
    if (onCycleStatus) {
      onCycleStatus(task.id);
    } else {
      onToggleStatus?.(task.id);
    }
  }, [task.id, onToggleStatus, onCycleStatus]);

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return '#FF3B30';
      case TaskPriority.MEDIUM:
        return '#FF9500';
      case TaskPriority.LOW:
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isInProgress = task.status === TaskStatus.IN_PROGRESS;
  const isDueDateOverdue = isOverdue(task.dueDate);

  /**
   * Get checkbox style and content based on status
   */
  const getCheckboxStyle = () => {
    if (isCompleted) {
      return [styles.checkbox, styles.checkboxCompleted];
    }
    if (isInProgress) {
      return [styles.checkbox, styles.checkboxInProgress];
    }
    return [styles.checkbox];
  };

  const getCheckboxContent = () => {
    if (isCompleted) {
      return <Text style={styles.checkmark}>✓</Text>;
    }
    if (isInProgress) {
      return <View style={styles.progressDot} />;
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.cardCompleted]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={getCheckboxStyle()}
            onPress={handleToggle}
          >
            {getCheckboxContent()}
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text
              style={[styles.title, isCompleted && styles.titleCompleted]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            {task.description && (
              <Text style={styles.description} numberOfLines={2}>
                {task.description}
              </Text>
            )}
          </View>
        </View>

        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(task.priority) },
          ]}
        >
          <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {task.dueDate && (
            <Text
              style={[
                styles.dueDate,
                isDueDateOverdue && !isCompleted && styles.dueDateOverdue,
              ]}
            >
              {formatDueDate(task.dueDate)}
            </Text>
          )}
          
          {task.estimatedMinutes && (
            <Text style={styles.timeText}>
              ⏱️ {task.estimatedMinutes}m
              {task.actualMinutes && ` / ${task.actualMinutes}m`}
            </Text>
          )}
        </View>

        {task.tags && task.tags.length > 0 && (
          <View style={styles.tags}>
            {task.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {task.tags.length > 2 && (
              <Text style={styles.moreTagsText}>+{task.tags.length - 2}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardCompleted: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  checkboxInProgress: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'column',
    gap: 4,
  },
  dueDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  dueDateOverdue: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#8E8E93',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#8E8E93',
    marginLeft: 4,
  },
});
