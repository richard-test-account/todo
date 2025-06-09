import React, { useState, FormEvent, ChangeEvent } from 'react';
import { TodoItem } from '../types/todo';
import './Todo.css';

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: new Date()
      }
    ]);
    setInputValue('');
  };

  const toggleTodo = (id: number): void => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-container">
      <h1>Things to do</h1>
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
          autoFocus
        />
        <button type="submit" className="add-button">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="todo-checkbox"
            />
            <span className="todo-text">{todo.text}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-button"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo; 