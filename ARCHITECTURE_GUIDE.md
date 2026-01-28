# Clean Architecture Guide - Task Manager

## Table of Contents
1. [Architecture Principles](#architecture-principles)
2. [Layer Separation](#layer-separation)
3. [Hook Usage & Rationale](#hook-usage--rationale)
4. [Performance Optimizations](#performance-optimizations)
5. [TypeScript Strategy](#typescript-strategy)
6. [Design Decisions](#design-decisions)

---

## Architecture Principles

### Clean Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│              (Components & Screens)                  │
│  - No business logic                                │
│  - Only UI rendering and user interaction           │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│              Business Logic Layer                    │
│           (Context, Hooks, Services)                │
│  - State management                                 │
│  - Business rules                                   │
│  - Data transformations                             │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│                  Data Layer                          │
│                 (Services)                           │
│  - Data persistence                                 │
│  - CRUD operations                                  │
│  - Storage abstraction                              │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│                  Core Layer                          │
│          (Types, Utils, Constants)                  │
│  - Type definitions                                 │
│  - Utility functions                                │
│  - Configuration                                    │
└─────────────────────────────────────────────────────┘
```

### Why This Architecture?

**1. Separation of Concerns**
- Each layer has a single, well-defined responsibility
- Changes in one layer don't cascade to others
- Easy to test each layer independently

**2. Dependency Rule**
- Dependencies point inward (Presentation → Business → Data → Core)
- Inner layers know nothing about outer layers
- Core has zero dependencies

**3. Scalability**
- Easy to add new features without touching existing code
- Can swap implementations (e.g., AsyncStorage → SQLite)
- Team members can work on different layers independently

---

## Layer Separation

### ❌ Bad: Business Logic in Components

```typescript
// DON'T DO THIS
function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  
  // ❌ Business logic in component
  const createTask = async (title: string) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      createdAt: new Date().toISOString(),
    };
    const stored = await AsyncStorage.getItem('@tasks');
    const existing = stored ? JSON.parse(stored) : [];
    await AsyncStorage.setItem('@tasks', JSON.stringify([...existing, newTask]));
    setTasks([...existing, newTask]);
  };
  
  return <View>...</View>;
}
```

### ✅ Good: Business Logic in Services/Hooks

```typescript
// ✅ Component only handles UI
function TaskScreen() {
  const { tasks, createTask } = useTasks(); // Hook handles business logic
  
  return (
    <View>
      <TaskList tasks={tasks} />
      <Button onPress={() => createTask({ title: 'New Task' })} />
    </View>
  );
}

// ✅ Business logic in service
class TaskService {
  async createTask(input: CreateTaskInput): Promise<Task> {
    const newTask = {
      id: this.generateId(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    const tasks = await this.getAllTasks();
    await StorageService.setItem(STORAGE_KEYS.TASKS, [...tasks, newTask]);
    return newTask;
  }
}
```

**Why?**
- Component is now 5 lines instead of 15
- Business logic is reusable across components
- Easy to test service independently
- Can change storage implementation without touching UI

---

## Hook Usage & Rationale

### useState - Local Component State

**When to use:**
- UI-specific state (modals, dropdowns, form inputs)
- State that doesn't need to be shared
- Temporary state

**Example:**
```typescript
function TaskCard({ task }: TaskCardProps) {
  // ✅ Local UI state - only this component cares
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
      {isExpanded && <Text>{task.description}</Text>}
    </TouchableOpacity>
  );
}
```

**Why useState here?**
- `isExpanded` is purely UI state
- No other component needs to know about it
- Doesn't need to persist

---

### useEffect - Side Effects & Lifecycle

**When to use:**
- Data fetching on mount
- Subscriptions
- Synchronizing with external systems
- Cleanup operations

**Example from TaskContext:**
```typescript
// ✅ Load tasks when component mounts
useEffect(() => {
  loadTasks();
}, [loadTasks]);
```

**Why useEffect here?**
- Side effect: fetching data from AsyncStorage
- Runs once on mount (loadTasks is stable via useCallback)
- Separates side effect from render logic

**Dependency Array Explained:**
- `[]` - Run once on mount
- `[loadTasks]` - Run when loadTasks changes (it won't, it's memoized)
- No array - Run on every render (usually wrong!)

---

### useCallback - Memoized Functions

**When to use:**
- Functions passed as props to child components
- Functions used in dependency arrays
- Event handlers that create closures

**Example from TaskContext:**
```typescript
const createTask = useCallback(async (input: CreateTaskInput): Promise<Task> => {
  try {
    setError(null);
    const newTask = await TaskService.createTask(input);
    setTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
    setError(errorMessage);
    throw err;
  }
}, []); // ✅ No dependencies - function is stable
```

**Why useCallback here?**
1. **Prevents unnecessary re-renders**: Child components using this function won't re-render unless the function actually changes
2. **Stable reference**: Can be safely used in dependency arrays
3. **Performance**: Especially important in lists with many items

**When NOT to use:**
```typescript
// ❌ Don't memoize if not passed to children or used in deps
function MyComponent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // Unnecessary - not passed anywhere
  
  return <View onPress={handleClick} />; // View doesn't memo-compare props
}
```

---

### useMemo - Memoized Values

**When to use:**
- Expensive computations
- Derived state
- Object/array creation that's used in dependency arrays

**Example from TasksScreen:**
```typescript
const filteredTasks = useMemo(() => {
  let filtered = tasks;

  // ✅ Expensive: filtering large arrays
  if (statusFilter !== 'all') {
    filtered = filtered.filter(task => task.status === statusFilter);
  }

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
```

**Why useMemo here?**
1. **Expensive operation**: Filtering potentially hundreds of tasks
2. **Runs on every render**: Without memo, filters run even when unrelated state changes
3. **Prevents wasted work**: Only recalculates when dependencies change

**Example from TaskContext:**
```typescript
const stats = calculateStats(tasks);
// ❌ Recalculates on every render

const stats = useMemo(() => calculateStats(tasks), [tasks]);
// ✅ Only recalculates when tasks change
```

---

### Custom Hooks - Reusable Logic

**When to create:**
- Logic used in multiple components
- Complex stateful logic
- Abstracting external systems

**Example: useTasks**
```typescript
export const useTasks = () => {
  const context = useContext(TaskContext);
  
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  
  return context;
};
```

**Why a custom hook?**
1. **Encapsulation**: Hides Context API complexity
2. **Error handling**: Catches usage outside provider
3. **Refactoring**: Can change implementation without touching components
4. **Type safety**: Single source of truth for return type

**Example: useDebounce**
```typescript
export const useDebounce = <T>(value: T, delay: number = 300): T => {
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
```

**Why this hook?**
1. **Reusable**: Works with any type (generic)
2. **Performance**: Prevents excessive API calls or filtering
3. **Cleanup**: Properly clears timeout on unmount
4. **Separation**: Search logic separate from UI

---

## Performance Optimizations

### 1. FlatList Optimization

```typescript
<FlatList
  data={filteredTasks}
  renderItem={renderItem}
  keyExtractor={(item) => item.id} // ✅ Stable key
  // Performance props
  removeClippedSubviews={true} // Unmount off-screen items
  maxToRenderPerBatch={10} // Render 10 items per batch
  updateCellsBatchingPeriod={50} // Batch updates every 50ms
  initialNumToRender={10} // Render 10 items initially
  windowSize={5} // Keep 5 screens worth of items in memory
  getItemLayout={(data, index) => ({ // Skip measurement
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

**Why these optimizations?**
- **keyExtractor**: Stable keys prevent unnecessary re-renders
- **removeClippedSubviews**: Reduces memory usage
- **Batching**: Smoother scrolling on large lists
- **getItemLayout**: Skips expensive measurement calculations

### 2. Memoized Callbacks in Lists

```typescript
// ❌ Bad: Creates new function on every render
<FlatList
  data={tasks}
  renderItem={({ item }) => (
    <TaskCard
      task={item}
      onPress={() => handlePress(item)} // New function every render!
    />
  )}
/>

// ✅ Good: Stable callback
const handleTaskPress = useCallback((task: Task) => {
  console.log('Task pressed:', task.id);
}, []);

const renderItem = useCallback(({ item }: { item: Task }) => (
  <TaskCard
    task={item}
    onPress={handleTaskPress}
  />
), [handleTaskPress]);

<FlatList
  data={tasks}
  renderItem={renderItem}
/>
```

**Why?**
- Each TaskCard receives the same function reference
- React.memo on TaskCard can prevent re-renders
- Especially important with 100+ items

### 3. Derived State with useMemo

```typescript
// ❌ Bad: Recalculates on every render
function TaskStats() {
  const { tasks } = useTasks();
  
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const percentage = (completedCount / totalCount) * 100;
  
  return <Text>{percentage}%</Text>;
}

// ✅ Good: Only recalculates when tasks change
function TaskStats() {
  const { tasks } = useTasks();
  
  const stats = useMemo(() => {
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const totalCount = tasks.length;
    const percentage = (completedCount / totalCount) * 100;
    return { completedCount, totalCount, percentage };
  }, [tasks]);
  
  return <Text>{stats.percentage}%</Text>;
}
```

### 4. Debounced Search

```typescript
function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  // ✅ Only filters when user stops typing for 300ms
  const filteredTasks = useMemo(() => {
    return tasks.filter(task =>
      task.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [tasks, debouncedQuery]);
  
  return (
    <Input
      value={searchQuery}
      onChangeText={setSearchQuery} // Updates immediately for UI
    />
  );
}
```

**Why debounce?**
- User types "hello" = 5 keystrokes
- Without debounce: 5 filter operations
- With debounce: 1 filter operation (after 300ms)
- 80% reduction in work!

---

## TypeScript Strategy

### No 'any' - Ever

```typescript
// ❌ Bad
function handleData(data: any) {
  return data.items.map((item: any) => item.name);
}

// ✅ Good
interface DataResponse {
  items: Array<{ name: string; id: string }>;
}

function handleData(data: DataResponse): string[] {
  return data.items.map(item => item.name);
}
```

### Strict Typing for Services

```typescript
class TaskService {
  // ✅ Explicit return types
  async createTask(input: CreateTaskInput): Promise<Task> {
    // TypeScript ensures we return a Task
  }
  
  // ✅ Explicit parameter types
  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    // TypeScript ensures id is string, input matches interface
  }
}
```

### Generic Hooks

```typescript
// ✅ Type-safe for any value type
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // ...
  return debouncedValue;
};

// Usage
const debouncedString = useDebounce<string>('hello', 300); // string
const debouncedNumber = useDebounce<number>(42, 300); // number
```

### Discriminated Unions

```typescript
// ✅ Type-safe status handling
type TaskStatus = 'todo' | 'in_progress' | 'completed';

function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'todo':
      return '#FF9500';
    case 'in_progress':
      return '#007AFF';
    case 'completed':
      return '#34C759';
    // TypeScript ensures all cases are handled
  }
}
```

---

## Design Decisions

### 1. Context API vs Redux

**Decision: Context API**

**Why?**
- Simpler setup (no middleware, no actions/reducers)
- Built into React (no extra dependencies)
- Sufficient for app-wide state
- Easy to understand for new developers

**When to use Redux instead:**
- Very complex state with many actions
- Need time-travel debugging
- Large team needs strict patterns

### 2. AsyncStorage vs SQLite

**Decision: AsyncStorage**

**Why?**
- Simple key-value storage
- No schema migrations
- Perfect for small-medium datasets
- Easy to swap later (service layer abstraction)

**When to use SQLite instead:**
- Complex queries (JOIN, GROUP BY)
- Large datasets (10,000+ items)
- Relational data

### 3. Service Layer Pattern

**Decision: Singleton services**

```typescript
class TaskService {
  // Methods here
}

export default new TaskService(); // Singleton
```

**Why?**
- Single source of truth
- Easy to mock for testing
- Can maintain internal state if needed
- Consistent API across app

### 4. Custom Hooks for Context

**Decision: Always wrap context with custom hook**

```typescript
// ✅ Always do this
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('Must use within provider');
  return context;
};

// ❌ Never do this in components
const context = useContext(TaskContext);
```

**Why?**
- Catches usage errors early
- Single import for consumers
- Can add logic/transformations
- Easy to refactor

### 5. Functional Components Only

**Decision: No class components**

**Why?**
- Hooks are more powerful
- Less boilerplate
- Better TypeScript inference
- Easier to test
- Industry standard (React team recommends)

---

## Summary

### Key Principles

1. **No business logic in components** - Use hooks and services
2. **Memoize intentionally** - Only when it provides value
3. **Type everything strictly** - No 'any', ever
4. **Optimize for mobile** - FlatList, debounce, memoization
5. **Separate concerns** - Clear layer boundaries

### Performance Checklist

- [ ] FlatList with keyExtractor
- [ ] Memoized callbacks in lists
- [ ] Debounced search inputs
- [ ] useMemo for expensive computations
- [ ] useCallback for functions passed to children
- [ ] Stable dependencies in useEffect

### Architecture Checklist

- [ ] Business logic in services/hooks
- [ ] Components only handle UI
- [ ] Custom hooks for reusable logic
- [ ] Service layer for data operations
- [ ] Types defined in separate files
- [ ] Utils for pure functions
