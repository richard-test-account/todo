import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { TodoItem, Category } from '../types/todo';
import './CategoryView.css';

interface CategoryViewProps {
  todos: TodoItem[];
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onUpdateDueDate: (id: number, date: Date) => void;
  onAddTodo: (text: string, description?: string, dueDate?: Date) => void;
  showAllTodos?: boolean;
}

const CategoryView: React.FC<CategoryViewProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onUpdateDueDate,
  onAddTodo,
  showAllTodos = false,
}) => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [inputValue, setInputValue] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [expandedTodo, setExpandedTodo] = useState<number | null>(null);

  const category = categoryId ? categoryId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') as Category : 'To classify';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    onAddTodo(inputValue, description, dueDate ? new Date(dueDate) : undefined);
    setInputValue('');
    setDescription('');
    setDueDate('');
  };

  const handleDateChange = (id: number, dateString: string) => {
    const date = new Date(dateString);
    onUpdateDueDate(id, date);
  };

  const filteredTodos = showAllTodos ? todos : todos.filter(todo => {
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
      <div className="category-header">
        <h2 className="category-title">{showAllTodos ? 'All Tasks' : category}</h2>
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
            <button type="submit" className="add-button">Add</button>
          </div>
          <textarea
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Add a description (supports markdown)"
            className="description-input"
            rows={3}
          />
        </form>
      </div>
      <div className="category-content">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">No tasks in this category</p>
            <p className="empty-hint">Add a new task using the form above</p>
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-main">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleTodo(todo.id)}
                    className="todo-checkbox"
                  />
                  <div className="todo-content">
                    <span className="todo-text">{todo.text}</span>
                    {todo.description && (
                      <button
                        className="expand-button"
                        onClick={() => setExpandedTodo(expandedTodo === todo.id ? null : todo.id)}
                      >
                        {expandedTodo === todo.id ? '▼' : '▶'}
                      </button>
                    )}
                  </div>
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
                </div>
                {todo.description && expandedTodo === todo.id && (
                  <div className="todo-description">
                    <ReactMarkdown>{todo.description}</ReactMarkdown>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryView; 