import React, { useState, FormEvent, ChangeEvent } from 'react';
import { TodoItem } from '../types/todo';
import CategoryList from './CategoryList';
import './Todo.css';

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: new Date(),
        dueDate: dueDate ? new Date(dueDate) : undefined
      }
    ]);
    setInputValue('');
    setDueDate('');
  };

  const toggleTodo = (id: number): void => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateDueDate = (id: number, date: Date): void => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, dueDate: date } : todo
    ));
  };

  return (
    <div className="todo-container">
      <h1>Things to do</h1>
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
            autoFocus
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
            className="date-input"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <button type="submit" className="add-button">Add</button>
      </form>
      <CategoryList
        todos={todos}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
        onUpdateDueDate={updateDueDate}
      />
    </div>
  );
};

export default Todo; 