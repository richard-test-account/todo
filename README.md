# Todo App

A modern, clean, and intuitive Todo application built with React and TypeScript, inspired by Things. This application provides a simple yet powerful way to manage your tasks with a beautiful user interface.

## Features

- ✨ Clean and modern UI inspired by Things
- 📋 Smart category system:
  - "To classify": Tasks without a due date
  - "Today": Tasks due today
  - "Later": Tasks due in the future
  - "Done": Completed tasks (moves here after 3 seconds)
- 📅 Easy date assignment:
  - Set due dates when creating tasks
  - Modify due dates for existing tasks
  - Automatic categorization based on due dates
- ✅ Task management:
  - Add new tasks
  - Mark tasks as complete
  - Delete tasks
  - Automatic movement to "Done" category
- 🎨 Smooth animations and transitions
- 📱 Responsive design
- 🔒 Type-safe with TypeScript
- ⚡ Fast and efficient

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/richard-test-account/todo.git
   cd todo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

### Adding Tasks
- Type your task in the input field
- Optionally select a due date
- Press Enter or click the "Add" button

### Managing Tasks
- **Completing a Task**: 
  - Click the checkbox next to a task
  - Task will automatically move to "Done" category after 3 seconds
- **Setting Due Date**: 
  - Use the date picker next to each task
  - Task will automatically move to the appropriate category
- **Deleting a Task**: Click the × button next to a task

### Categories
- **To classify**: Tasks without a due date
- **Today**: Tasks due today
- **Later**: Tasks due in the future
- **Done**: Completed tasks (appears here 3 seconds after completion)

## Technologies Used

- React
- TypeScript
- CSS3
- Create React App

## Project Structure

```
todo/
├── src/
│   ├── components/
│   │   ├── Todo.tsx
│   │   ├── Todo.css
│   │   ├── CategoryList.tsx
│   │   └── CategoryList.css
│   ├── types/
│   │   └── todo.ts
│   ├── App.tsx
│   └── index.tsx
├── public/
└── package.json
```

## Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by the Things app
- Built with Create React App
- TypeScript for type safety
