import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TodoItem } from './types/todo';
import CategoryView from './components/CategoryView';
import Layout from './components/Layout';
import { todoDB } from './services/db';
import './App.css';

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDB = async () => {
      try {
        await todoDB.init();
        const savedTodos = await todoDB.getAllTodos();
        setTodos(savedTodos);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  const addTodo = async (text: string, description?: string, dueDate?: Date) => {
    const newTodo: TodoItem = {
      id: Date.now(),
      text,
      description,
      completed: false,
      dueDate: dueDate || undefined,
      createdAt: new Date()
    };

    try {
      await todoDB.addTodo(newTodo);
      setTodos([...todos, newTodo]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const updateTodo = async (id: number, text: string, description?: string) => {
    const updatedTodo = todos.find(todo => todo.id === id);
    if (!updatedTodo) return;

    const newTodo = { ...updatedTodo, text, description };
    try {
      await todoDB.updateTodo(newTodo);
      setTodos(todos.map(todo =>
        todo.id === id ? newTodo : todo
      ));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const toggleTodo = async (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
    try {
      await todoDB.updateTodo(updatedTodo);
      setTodos(todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoDB.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const updateDueDate = async (id: number, date: Date) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    const updatedTodo = { ...todoToUpdate, dueDate: date };
    try {
      await todoDB.updateTodo(updatedTodo);
      setTodos(todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
    } catch (error) {
      console.error('Failed to update due date:', error);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CategoryView todos={todos} onAddTodo={addTodo} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo} onUpdateTodo={updateTodo} onUpdateDueDate={updateDueDate} showAllTodos />} />
          <Route path="/category/:category" element={<CategoryView todos={todos} onAddTodo={addTodo} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo} onUpdateTodo={updateTodo} onUpdateDueDate={updateDueDate} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 