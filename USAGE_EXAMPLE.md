# Task Manager - Usage Examples

## Quick Start

### 1. Using the Task Context

```typescript
import { useTasks } from './src/hooks/useTasks';

function MyComponent() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  
  // Use tasks in your component
  return (
    <View>
      {tasks.map(task => (
        <Text key={task.id}>{task.title}</Text>
      ))}
    </View>
  );
}
```

### 2. Creating a Task

```typescript
import { useTasks } from './src/hooks/useTasks';
import { TaskPriority } from './src/types/task.types';

function CreateTaskExample() {
  const { createTask } = useTasks();
  
  const handleCreate = async () => {
    try {
      const newTask = await createTask({
        title: 'Complete project documentation',
        description: 'Write comprehensive docs for the project',
        priority: TaskPriority.HIGH,
        dueDate: new Date('2026-02-01').toISOString(),
        tags: ['documentation', 'urgent'],
      });
      console.log('Task created:', newTask);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };
  
  return <Button title="Create Task" onPress={handleCreate} />;
}
```

### 3. Updating a Task

```typescript
import { useTasks } from './src/hooks/useTasks';
import { TaskStatus } from './src/types/task.types';

function UpdateTaskExample({ taskId }: { taskId: string }) {
  const { updateTask } = useTasks();
  
  const handleUpdate = async () => {
    try {
      await updateTask(taskId, {
        status: TaskStatus.IN_PROGRESS,
        title: 'Updated task title',
      });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };
  
  return <Button title="Update Task" onPress={handleUpdate} />;
}
```

### 4. Using the Form Hook

```typescript
import { useForm } from './src/hooks/useForm';
import { validateTaskTitle } from './src/utils/validation.utils';

interface TaskFormValues {
  title: string;
  description: string;
}

function TaskFormExample() {
  const { values, errors, handleChange, handleSubmit } = useForm<TaskFormValues>({
    initialValues: {
      title: '',
      description: '',
    },
    validate: (values) => {
      const errors: any = {};
      const titleError = validateTaskTitle(values.title);
      if (titleError) errors.title = titleError;
      return errors;
    },
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
      // Create task here
    },
  });
  
  return (
    <View>
      <Input
        label="Title"
        value={values.title}
        onChangeText={handleChange('title')}
        error={errors.title}
      />
      <Input
        label="Description"
        value={values.description}
        onChangeText={handleChange('description')}
        multiline
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
```

### 5. Using Debounce for Search

```typescript
import { useState } from 'react';
import { useDebounce } from './src/hooks/useDebounce';
import { useTasks } from './src/hooks/useTasks';

function SearchExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { tasks } = useTasks();
  
  // Filter tasks based on debounced query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(debouncedQuery.toLowerCase())
  );
  
  return (
    <View>
      <Input
        placeholder="Search tasks..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TaskList tasks={filteredTasks} />
    </View>
  );
}
```

### 6. Direct Service Usage (Advanced)

```typescript
import TaskService from './src/services/task.service';
import { TaskPriority } from './src/types/task.types';

async function directServiceExample() {
  // Create a task
  const task = await TaskService.createTask({
    title: 'Direct service task',
    priority: TaskPriority.MEDIUM,
  });
  
  // Get all tasks
  const allTasks = await TaskService.getAllTasks();
  
  // Search tasks
  const searchResults = await TaskService.searchTasks('important');
  
  // Update task
  await TaskService.updateTask(task.id, {
    title: 'Updated title',
  });
  
  // Delete task
  await TaskService.deleteTask(task.id);
}
```

### 7. Custom Component with Task Card

```typescript
import { TaskCard } from './src/components/task/TaskCard';
import { useTasks } from './src/hooks/useTasks';

function MyTaskList() {
  const { tasks, toggleTaskStatus, deleteTask } = useTasks();
  
  return (
    <View>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onPress={(task) => console.log('Pressed:', task.title)}
          onToggleStatus={toggleTaskStatus}
          onDelete={deleteTask}
        />
      ))}
    </View>
  );
}
```

### 8. Filtering Tasks

```typescript
import { useTasks } from './src/hooks/useTasks';
import { TaskStatus, TaskPriority } from './src/types/task.types';

function FilterExample() {
  const { tasks } = useTasks();
  
  // Filter by status
  const completedTasks = tasks.filter(
    task => task.status === TaskStatus.COMPLETED
  );
  
  // Filter by priority
  const highPriorityTasks = tasks.filter(
    task => task.priority === TaskPriority.HIGH
  );
  
  // Filter by due date (overdue tasks)
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  });
  
  return (
    <View>
      <Text>Completed: {completedTasks.length}</Text>
      <Text>High Priority: {highPriorityTasks.length}</Text>
      <Text>Overdue: {overdueTasks.length}</Text>
    </View>
  );
}
```

### 9. Task Statistics

```typescript
import { useTasks } from './src/hooks/useTasks';

function StatsExample() {
  const { stats } = useTasks();
  
  return (
    <View>
      <Text>Total Tasks: {stats.total}</Text>
      <Text>Completed: {stats.completed}</Text>
      <Text>In Progress: {stats.inProgress}</Text>
      <Text>To Do: {stats.todo}</Text>
      <Text>Completion Rate: {
        stats.total > 0 
          ? Math.round((stats.completed / stats.total) * 100) 
          : 0
      }%</Text>
    </View>
  );
}
```

### 10. Error Handling

```typescript
import { useTasks } from './src/hooks/useTasks';
import { useState } from 'react';

function ErrorHandlingExample() {
  const { createTask, error } = useTasks();
  const [localError, setLocalError] = useState<string | null>(null);
  
  const handleCreate = async () => {
    try {
      setLocalError(null);
      await createTask({
        title: 'New task',
      });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Unknown error');
    }
  };
  
  return (
    <View>
      <Button title="Create Task" onPress={handleCreate} />
      {(error || localError) && (
        <Text style={{ color: 'red' }}>
          {error || localError}
        </Text>
      )}
    </View>
  );
}
```

## Best Practices

1. **Always use the `useTasks` hook** instead of directly accessing the context
2. **Handle errors** in async operations
3. **Use TypeScript types** for type safety
4. **Debounce search inputs** to improve performance
5. **Use memoization** for expensive computations
6. **Keep components small** and focused on a single responsibility
7. **Use the service layer** for complex business logic
8. **Validate user input** before submitting

## Common Patterns

### Loading State
```typescript
const { loading } = useTasks();

if (loading) {
  return <ActivityIndicator />;
}
```

### Empty State
```typescript
const { tasks } = useTasks();

if (tasks.length === 0) {
  return <Text>No tasks yet!</Text>;
}
```

### Refresh Control
```typescript
const { refreshTasks, loading } = useTasks();

<FlatList
  refreshControl={
    <RefreshControl
      refreshing={loading}
      onRefresh={refreshTasks}
    />
  }
/>
```
