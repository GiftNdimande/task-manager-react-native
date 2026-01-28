# Task Manager - React Native App

A production-ready Task Manager mobile application built with Expo and React Native, featuring clean architecture, functional components, hooks, and local persistence.

## ✨ Features

- ✅ **Create, Edit, Delete Tasks** - Full CRUD operations
- ✅ **Three Status States** - TODO → IN_PROGRESS → COMPLETED
- ✅ **Priority Levels** - Low, Medium, High
- ✅ **Search & Filter** - Find tasks quickly
- ✅ **Real-time Statistics** - Track your progress
- ✅ **Local Persistence** - Data saved with AsyncStorage
- ✅ **Clean UI** - Modern, intuitive interface
- ✅ **Fully Typed** - TypeScript throughout

## 🚀 Quick Start

```bash
cd task-vibe
npm install
npm start
```

Then scan the QR code with Expo Go app or press `i` for iOS simulator / `a` for Android emulator.

See [`GETTING_STARTED.md`](./GETTING_STARTED.md) for detailed setup instructions.

## 🏗️ Architecture

This project follows **clean architecture** principles with clear separation of concerns:

- **Presentation Layer**: UI components and screens
- **Business Logic Layer**: Context, hooks, and state management
- **Data Layer**: Services for data persistence
- **Core Layer**: Types, constants, and utilities

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for technical details and [`ARCHITECTURE_GUIDE.md`](./ARCHITECTURE_GUIDE.md) for in-depth explanations.

## 📁 Project Structure

```
task-vibe/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx            # Home/Tasks screen
│   │   └── _layout.tsx          # Tab layout
│   └── _layout.tsx              # Root layout with providers
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Generic components (Button, Input)
│   │   └── task/                # Task-specific components
│   │
│   ├── context/                 # React Context providers
│   │   └── TaskContext.tsx      # Task state management
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useTasks.ts          # Task operations hook
│   │   ├── useDebounce.ts       # Debounce utility
│   │   └── useForm.ts           # Form handling
│   │
│   ├── services/                # Data services
│   │   ├── storage.service.ts   # AsyncStorage wrapper
│   │   └── task.service.ts      # Task CRUD operations
│   │
│   ├── types/                   # TypeScript types
│   │   ├── task.types.ts        # Task-related types
│   │   └── common.types.ts      # Shared types
│   │
│   ├── constants/               # App constants
│   │   ├── storage.ts           # Storage keys
│   │   └── config.ts            # App configuration
│   │
│   ├── utils/                   # Utility functions
│   │   ├── date.utils.ts        # Date formatting
│   │   └── validation.utils.ts  # Input validation
│   │
│   └── screens/                 # Screen components
│       └── TasksScreen.tsx      # Main tasks screen
│
└── assets/                      # Static assets
```

## ✨ Features

- ✅ **Functional Components Only** - No class components
- ✅ **React Hooks** - useState, useEffect, useCallback, useMemo
- ✅ **TypeScript** - Full type safety
- ✅ **AsyncStorage** - Local data persistence
- ✅ **Context API** - Global state management
- ✅ **Custom Hooks** - Reusable logic
- ✅ **Clean Architecture** - Scalable folder structure
- ✅ **Service Layer** - Separation of concerns
- ✅ **Validation** - Input validation utilities
- ✅ **Date Utilities** - Smart date formatting
- ✅ **Search & Filter** - Debounced search with filters
- ✅ **Task Statistics** - Real-time task stats

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Navigate to the project directory:
```bash
cd task-vibe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## 📖 Usage

### Using the Task Hook

```typescript
import { useTasks } from './src/hooks/useTasks';

function MyComponent() {
  const { tasks, createTask, updateTask, deleteTask, stats } = useTasks();
  
  // Create a task
  const handleCreate = async () => {
    await createTask({
      title: 'New Task',
      priority: TaskPriority.HIGH,
    });
  };
  
  return (
    <View>
      <Text>Total: {stats.total}</Text>
      <Button title="Create Task" onPress={handleCreate} />
    </View>
  );
}
```

See [`USAGE_EXAMPLE.md`](./USAGE_EXAMPLE.md) for more examples.

## 🎨 Components

### Common Components
- **Button** - Reusable button with variants (primary, secondary, danger, outline)
- **Input** - Text input with label and error handling

### Task Components
- **TaskCard** - Individual task display with status toggle
- **TaskList** - FlatList of tasks with empty state

### Screens
- **TasksScreen** - Main screen with search, filters, and task list

## 🔧 Services

### StorageService
Type-safe wrapper around AsyncStorage for data persistence.

```typescript
import StorageService from './src/services/storage.service';

await StorageService.setItem(STORAGE_KEYS.TASKS, tasks);
const tasks = await StorageService.getItem(STORAGE_KEYS.TASKS);
```

### TaskService
Handles all task CRUD operations.

```typescript
import TaskService from './src/services/task.service';

const task = await TaskService.createTask({ title: 'New Task' });
await TaskService.updateTask(taskId, { status: TaskStatus.COMPLETED });
await TaskService.deleteTask(taskId);
```

## 🎯 Key Patterns

### 1. Context + Custom Hooks
```typescript
// Context provides state
// Custom hooks provide operations
const { tasks, createTask } = useTasks();
```

### 2. Service Layer
```typescript
// Services handle data operations
// Components don't directly access storage
await TaskService.createTask(task);
```

### 3. Component Composition
```typescript
// Small, focused components
<TaskList>
  <TaskCard />
</TaskList>
```

## 📝 Type System

All types are defined in [`src/types/`](./src/types/):

- **Task** - Main task interface
- **TaskStatus** - Enum for task statuses (TODO, IN_PROGRESS, COMPLETED)
- **TaskPriority** - Enum for priorities (LOW, MEDIUM, HIGH)
- **CreateTaskInput** - Input for creating tasks
- **UpdateTaskInput** - Input for updating tasks

## 🛠️ Utilities

### Date Utils
- `formatDate()` - Smart date formatting (Today, Yesterday, etc.)
- `formatDueDate()` - Due date with overdue detection
- `isOverdue()` - Check if task is overdue

### Validation Utils
- `validateTaskTitle()` - Title validation
- `validateTaskDescription()` - Description validation
- `sanitizeInput()` - Input sanitization

## 🧪 Best Practices

1. **Always use hooks** - Never access context directly
2. **Handle errors** - Wrap async operations in try-catch
3. **Type everything** - Use TypeScript for type safety
4. **Debounce inputs** - Use useDebounce for search
5. **Memoize callbacks** - Use useCallback for event handlers
6. **Keep components small** - Single responsibility principle
7. **Use service layer** - Don't access storage directly

## 🔄 Data Flow

```
User Interaction
      ↓
  Component
      ↓
  Custom Hook (useTasks)
      ↓
  Context (TaskContext)
      ↓
  Service (TaskService)
      ↓
  Storage (AsyncStorage)
```

## 📦 Dependencies

- **expo** - React Native framework
- **react-native** - Mobile framework
- **@react-native-async-storage/async-storage** - Local storage
- **expo-router** - File-based routing
- **typescript** - Type safety

## 🚀 Future Enhancements

- [ ] Task categories and tags
- [ ] Push notifications for due dates
- [ ] Task sharing and collaboration
- [ ] Cloud sync
- [ ] Dark mode
- [ ] Task attachments
- [ ] Recurring tasks
- [ ] Task templates

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ using React Native and Expo

---

For detailed architecture information, see [`ARCHITECTURE.md`](./ARCHITECTURE.md)

For usage examples, see [`USAGE_EXAMPLE.md`](./USAGE_EXAMPLE.md)
