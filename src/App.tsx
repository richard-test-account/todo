import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CategoryView from './components/CategoryView';
import { TodoItem } from './types/todo';
import { openDB } from 'idb';
import './App.css';

const dbPromise = openDB('todo-db', 1, {
  upgrade(db) {
    db.createObjectStore('todos');
  },
});

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const db = await dbPromise;
        const storedTodos = await db.get('todos', 'todos');
        if (storedTodos) {
          setTodos(storedTodos);
        }
      } catch (error) {
        console.error('Failed to load todos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTodos();
  }, []);

  const saveTodos = async (newTodos: TodoItem[]) => {
    try {
      const db = await dbPromise;
      await db.put('todos', newTodos, 'todos');
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  };

  const addTodo = async (text: string, description?: string, dueDate?: Date) => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      description,
      dueDate,
      completed: false,
      createdAt: new Date(),
    };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  const toggleTodo = async (id: string) => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  const deleteTodo = async (id: string) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  const updateTodo = async (id: string, text: string, description?: string, dueDate?: Date) => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, text, description, dueDate } : todo
    );
    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/to-classify" replace />} />
            <Route
              path="/to-classify"
              element={
                <CategoryView
                  todos={todos.filter(todo => !todo.dueDate)}
                  onAddTodo={addTodo}
                  onToggleTodo={toggleTodo}
                  onDeleteTodo={deleteTodo}
                  onUpdateTodo={updateTodo}
                  category="To Classify"
                />
              }
            />
            <Route
              path="/today"
              element={
                <CategoryView
                  todos={todos.filter(todo => {
                    if (!todo.dueDate) return false;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const todoDate = new Date(todo.dueDate);
                    todoDate.setHours(0, 0, 0, 0);
                    return todoDate.getTime() === today.getTime();
                  })}
                  onAddTodo={addTodo}
                  onToggleTodo={toggleTodo}
                  onDeleteTodo={deleteTodo}
                  onUpdateTodo={updateTodo}
                  category="Today"
                />
              }
            />
            <Route
              path="/later"
              element={
                <CategoryView
                  todos={todos.filter(todo => {
                    if (!todo.dueDate) return false;
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(0, 0, 0, 0);
                    return new Date(todo.dueDate) >= tomorrow;
                  })}
                  onAddTodo={addTodo}
                  onToggleTodo={toggleTodo}
                  onDeleteTodo={deleteTodo}
                  onUpdateTodo={updateTodo}
                  category="Later"
                />
              }
            />
            <Route
              path="/done"
              element={
                <CategoryView
                  todos={todos.filter(todo => todo.completed)}
                  onAddTodo={addTodo}
                  onToggleTodo={toggleTodo}
                  onDeleteTodo={deleteTodo}
                  onUpdateTodo={updateTodo}
                  category="Done"
                />
              }
            />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App; 