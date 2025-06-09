import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
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
  onUpdateTodo: (id: number, text: string, description?: string) => void;
  showAllTodos?: boolean;
}

const CategoryView: React.FC<CategoryViewProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onUpdateDueDate,
  onAddTodo,
  onUpdateTodo,
  showAllTodos = false,
}) => {
  const { category } = useParams<{ category: string }>();
  const [inputValue, setInputValue] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [expandedTodo, setExpandedTodo] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const categoryName = category ? category.split('-').map(word => 
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

  const handleDoubleClick = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditDescription(todo.description || '');
  };

  const handleEditSubmit = (id: number) => {
    onUpdateTodo(id, editText, editDescription);
    setEditingId(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const filteredTodos = showAllTodos ? todos : todos.filter(todo => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (categoryName) {
      case 'To classify':
        return !todo.dueDate;
      case 'Today':
        return todo.dueDate && new Date(todo.dueDate).setHours(0, 0, 0, 0) === today.getTime();
      case 'Later':
        return todo.dueDate && new Date(todo.dueDate) >= tomorrow;
      case 'Done':
        return todo.completed;
      default:
        return false;
    }
  });

  return (
    <div className="category-view">
      <div className="category-header">
        <h2 className="category-title">{showAllTodos ? 'All Tasks' : categoryName}</h2>
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
                {editingId === todo.id ? (
                  <div className="todo-edit">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                      className="todo-input"
                      autoFocus
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Add a description (supports markdown)..."
                      className="description-input"
                    />
                    <div className="todo-edit-actions">
                      <button onClick={() => handleEditSubmit(todo.id)} className="save-button">Save</button>
                      <button onClick={() => setEditingId(null)} className="cancel-button">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="todo-main" onDoubleClick={() => handleDoubleClick(todo)}>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedTodo(expandedTodo === todo.id ? null : todo.id);
                          }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTodo(todo.id);
                      }}
                      className="delete-button"
                    >
                      ×
                    </button>
                  </div>
                )}
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