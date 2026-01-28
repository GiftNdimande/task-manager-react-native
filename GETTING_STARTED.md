# Getting Started with Task Manager

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Expo CLI** - Will be installed with dependencies
- **iOS Simulator** (Mac only) or **Android Emulator** (optional)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd task-vibe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

4. **Run on your preferred platform:**
   
   **iOS (Mac only):**
   ```bash
   npm run ios
   ```
   
   **Android:**
   ```bash
   npm run android
   ```
   
   **Web:**
   ```bash
   npm run web
   ```

   **Expo Go App (Recommended for beginners):**
   - Install Expo Go on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
   - Scan the QR code shown in the terminal

## 📱 Using the App

### Creating a Task

1. Tap the **blue + button** (floating action button) at the bottom-right
2. Fill in the task details:
   - **Title** (required)
   - **Description** (optional)
   - **Priority** (Low, Medium, High)
3. Tap **"Create Task"**

### Managing Task Status

Tasks have three statuses that you can cycle through by tapping the checkbox:

1. **TODO** (Empty circle) - Task not started
2. **IN_PROGRESS** (Blue with dot) - Task in progress
3. **COMPLETED** (Green with checkmark) - Task completed

Tap the checkbox repeatedly to cycle through these states.

### Editing a Task

1. Tap on any task card
2. Edit the details in the modal
3. Tap **"Save Changes"**

### Deleting a Task

1. Tap on the task you want to delete
2. In the edit modal, tap **"Delete"**
3. Confirm the deletion

### Filtering Tasks

Use the filter buttons to view:
- **All** - All tasks
- **To Do** - Only TODO tasks
- **In Progress** - Only IN_PROGRESS tasks
- **Done** - Only COMPLETED tasks

### Searching Tasks

Type in the search bar to filter tasks by title or description. The search is debounced for better performance.

## 🏗️ Project Structure

```
task-vibe/
├── app/                    # Expo Router screens
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom hooks
│   ├── services/         # Data services
│   ├── types/            # TypeScript types
│   ├── constants/        # App constants
│   ├── utils/            # Utility functions
│   └── screens/          # Screen components
└── assets/               # Static assets
```

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture overview
- **[ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md)** - Detailed architecture explanations
- **[USAGE_EXAMPLE.md](./USAGE_EXAMPLE.md)** - Code examples and patterns
- **[README.md](./README.md)** - Project overview

## 🛠️ Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

### Code Style

This project follows:
- **Functional components only** - No class components
- **TypeScript** - Strict typing, no 'any'
- **Clean architecture** - Separation of concerns
- **Hooks** - useState, useEffect, useCallback, useMemo

### Making Changes

1. **Components** - Add new components in `src/components/`
2. **Screens** - Add new screens in `src/screens/`
3. **Services** - Add business logic in `src/services/`
4. **Types** - Define types in `src/types/`

## 🐛 Troubleshooting

### Metro Bundler Issues

If you encounter bundler issues:
```bash
npm start -- --reset-cache
```

### iOS Simulator Not Opening

```bash
npx expo run:ios
```

### Android Emulator Issues

1. Ensure Android Studio is installed
2. Create an AVD (Android Virtual Device)
3. Start the emulator before running `npm run android`

### Dependencies Issues

```bash
rm -rf node_modules
npm install
```

## 📦 Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

Note: You'll need an Expo account and EAS CLI configured.

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript strictly
3. Keep components functional
4. Add comments for complex logic
5. Test your changes

## 📄 License

MIT

## 🆘 Need Help?

- Check the [documentation](./ARCHITECTURE.md)
- Review [code examples](./USAGE_EXAMPLE.md)
- Read the [architecture guide](./ARCHITECTURE_GUIDE.md)

---

**Happy coding! 🎉**
