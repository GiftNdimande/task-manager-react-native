/**
 * Edit Task Modal Component
 * Modal for editing existing tasks with form validation and delete option
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useTasks } from '../../hooks/useTasks';
import { Task, TaskPriority } from '../../types/task.types';
import { validateTaskTitle, validateTaskDescription } from '../../utils/validation.utils';

interface EditTaskModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ visible, task, onClose }) => {
  const { updateTask, deleteTask } = useTasks();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  /**
   * Initialize form with task data when task changes
   * useEffect to sync form state with task prop
   */
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setErrors({});
    }
  }, [task]);

  /**
   * Validate form fields
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: { title?: string; description?: string } = {};
    
    const titleError = validateTaskTitle(title);
    if (titleError) newErrors.title = titleError;
    
    const descError = validateTaskDescription(description);
    if (descError) newErrors.description = descError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, description]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!task || !validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      });
      
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update task. Please try again.');
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [task, title, description, priority, updateTask, onClose, validateForm]);

  /**
   * Handle task deletion with confirmation
   */
  const handleDelete = useCallback(() => {
    if (!task) return;
    
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id);
              onClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task. Please try again.');
              console.error('Error deleting task:', error);
            }
          },
        },
      ]
    );
  }, [task, deleteTask, onClose]);

  /**
   * Handle modal close
   */
  const handleClose = useCallback(() => {
    setErrors({});
    onClose();
  }, [onClose]);

  /**
   * Handle priority selection
   */
  const handlePrioritySelect = useCallback((selectedPriority: TaskPriority) => {
    setPriority(selectedPriority);
  }, []);

  if (!task) return null;

  return (
    <Modal visible={visible} onClose={handleClose} title="Edit Task">
      <View style={styles.form}>
        <Input
          label="Title *"
          placeholder="Enter task title"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
          autoFocus
        />

        <Input
          label="Description"
          placeholder="Enter task description (optional)"
          value={description}
          onChangeText={setDescription}
          error={errors.description}
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <View style={styles.priorityContainer}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityButtons}>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                styles.priorityLow,
                priority === TaskPriority.LOW && styles.priorityButtonActive,
              ]}
              onPress={() => handlePrioritySelect(TaskPriority.LOW)}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === TaskPriority.LOW && styles.priorityTextActive,
                ]}
              >
                Low
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.priorityButton,
                styles.priorityMedium,
                priority === TaskPriority.MEDIUM && styles.priorityButtonActive,
              ]}
              onPress={() => handlePrioritySelect(TaskPriority.MEDIUM)}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === TaskPriority.MEDIUM && styles.priorityTextActive,
                ]}
              >
                Medium
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.priorityButton,
                styles.priorityHigh,
                priority === TaskPriority.HIGH && styles.priorityButtonActive,
              ]}
              onPress={() => handlePrioritySelect(TaskPriority.HIGH)}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === TaskPriority.HIGH && styles.priorityTextActive,
                ]}
              >
                High
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Delete"
            onPress={handleDelete}
            variant="danger"
            style={styles.deleteButton}
          />
          <Button
            title="Save Changes"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityLow: {
    borderColor: '#34C759',
    backgroundColor: '#F0FFF4',
  },
  priorityMedium: {
    borderColor: '#FF9500',
    backgroundColor: '#FFF8F0',
  },
  priorityHigh: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF0F0',
  },
  priorityButtonActive: {
    borderWidth: 2,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  priorityTextActive: {
    color: '#000000',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
