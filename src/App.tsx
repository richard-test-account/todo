import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CategoryView from './components/CategoryView';
import { TodoItem } from './types/todo';
import './App.css';

const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, dueDate?: Date) => {
    const newTodo: TodoItem = {
      id: Date.now(),
      text,
      completed: false,
      dueDate,
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateDueDate = (id: number, date: Date) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, dueDate: date } : todo
      )
    );
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/to-classify" replace />} />
          <Route
            path="/:categoryId"
            element={
              <CategoryView
                todos={todos}
                onToggleTodo={toggleTodo}
                onDeleteTodo={deleteTodo}
                onUpdateDueDate={updateDueDate}
                onAddTodo={addTodo}
              />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App; 