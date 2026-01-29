/**
 * Create Task Modal Component
 * Modal for creating new tasks with form validation
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useTasks } from '../../hooks/useTasks';
import { TaskPriority } from '../../types/task.types';
import { validateTaskTitle, validateTaskDescription } from '../../utils/validation.utils';

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ visible, onClose }) => {
  const { createTask } = useTasks();
  
  // Form state - useState for local UI state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  /**
   * Validate form fields
   * Returns true if valid, false otherwise
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
   * useCallback to prevent recreation on every render
   */
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes, 10) : undefined,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority(TaskPriority.MEDIUM);
      setEstimatedMinutes('');
      setErrors({});
      
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create task. Please try again.');
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, priority, createTask, onClose, validateForm]);

  /**
   * Handle modal close
   * Reset form state when closing
   */
  const handleClose = useCallback(() => {
    setTitle('');
    setDescription('');
    setPriority(TaskPriority.MEDIUM);
    setEstimatedMinutes('');
    setErrors({});
    onClose();
  }, [onClose]);

  /**
   * Handle priority selection
   * useCallback to prevent recreation
   */
  const handlePrioritySelect = useCallback((selectedPriority: TaskPriority) => {
    setPriority(selectedPriority);
  }, []);

  return (
    <Modal visible={visible} onClose={handleClose} title="Create New Task">
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

        <Input
          label="Estimated Time (minutes)"
          placeholder="How long will this take? (optional)"
          value={estimatedMinutes}
          onChangeText={setEstimatedMinutes}
          keyboardType="numeric"
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
            title="Cancel"
            onPress={handleClose}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Create Task"
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
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
