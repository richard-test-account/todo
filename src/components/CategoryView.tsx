import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { TodoItem, Category } from '../types/todo';
import './CategoryView.css';

interface CategoryViewProps {
  todos: TodoItem[];
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onUpdateDueDate: (id: number, date: Date) => void;
  onAddTodo: (text: string, dueDate?: Date) => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onUpdateDueDate,
  onAddTodo,
}) => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [inputValue, setInputValue] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  const category = categoryId?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') as Category;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    onAddTodo(inputValue, dueDate ? new Date(dueDate) : undefined);
    setInputValue('');
    setDueDate('');
  };

  const handleDateChange = (id: number, dateString: string) => {
    const date = new Date(dateString);
    onUpdateDueDate(id, date);
  };

  const filteredTodos = todos.filter(todo => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (category) {
      case 'To classify':
        return !todo.dueDate;
      case 'Today':
        return todo.dueDate && new Date(todo.dueDate).setHours(0, 0, 0, 0) === today.getTime();
      case 'Later':
        return todo.dueDate && new Date(todo.dueDate) > today;
      case 'Done':
        return todo.completed;
      default:
        return false;
    }
  });

  return (
    <div className="category-view">
      <h2 className="category-title">{category}</h2>
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
      {filteredTodos.length === 0 ? (
        <p className="empty-message">No tasks in this category</p>
      ) : (
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span className="todo-text">{todo.text}</span>
              {!todo.completed && (
                <input
                  type="date"
                  value={todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange(todo.id, e.target.value)}
                  className="todo-date"
                />
              )}
              <button
                onClick={() => onDeleteTodo(todo.id)}
                className="delete-button"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryView; 