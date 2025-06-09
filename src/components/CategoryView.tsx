import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { TodoItem } from '../types/todo';
import './CategoryView.css';

interface CategoryViewProps {
  todos: TodoItem[];
  onAddTodo: (text: string, description?: string, dueDate?: Date) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, text: string, description?: string, dueDate?: Date) => void;
  category: string;
}

const categoryEmojis: { [key: string]: string } = {
  'To Classify': '📋',
  'Today': '📅',
  'Later': '⏳',
  'Done': '✅'
};

const CategoryView: React.FC<CategoryViewProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
  category
}) => {
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState<string>('');
  const [showDescription, setShowDescription] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState<string>('');
  const [expandedTodos, setExpandedTodos] = useState<Set<string>>(new Set());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const dueDate = newTodoDueDate ? new Date(newTodoDueDate) : undefined;
    onAddTodo(newTodoText.trim(), newTodoDescription.trim() || undefined, dueDate);
    setNewTodoText('');
    setNewTodoDescription('');
    setNewTodoDueDate('');
    setShowDescription(false);
  };

  const handleEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;

    const dueDate = editDueDate ? new Date(editDueDate) : undefined;
    onUpdateTodo(id, editText.trim(), editDescription.trim() || undefined, dueDate);
    setEditingId(null);
  };

  const toggleExpanded = (id: string) => {
    setExpandedTodos(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="category-view">
      <h1 className="category-title">
        <span className="category-emoji">{categoryEmojis[category]}</span>
        {category}
      </h1>

      <form className="todo-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            className="todo-input"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new task..."
          />
          <button type="submit" className="add-button">
            Add
          </button>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="toggle-description-button"
            onClick={() => setShowDescription(!showDescription)}
          >
            {showDescription ? 'Hide description' : 'Add description'}
          </button>
          <input
            type="date"
            className="date-input"
            value={newTodoDueDate}
            onChange={(e) => setNewTodoDueDate(e.target.value)}
          />
        </div>

        {showDescription && (
          <textarea
            className="description-input"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            placeholder="Add a description (supports markdown)..."
          />
        )}
      </form>

      <div className="todos-list">
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            {editingId === todo.id ? (
              <div className="todo-edit">
                <input
                  type="text"
                  className="edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <textarea
                  className="description-input"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a description (supports markdown)..."
                />
                <input
                  type="date"
                  className="date-input"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
                <div className="edit-actions">
                  <button
                    className="save-button"
                    onClick={() => handleSaveEdit(todo.id)}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="todo-main">
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleTodo(todo.id)}
                  />
                  <div className="todo-content">
                    <div
                      className="todo-text"
                      onDoubleClick={() => handleEdit(todo)}
                    >
                      {todo.text}
                    </div>
                    {todo.dueDate && (
                      <div className="todo-date">
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="todo-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(todo)}
                    >
                      ✎
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => onDeleteTodo(todo.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
                {todo.description && (
                  <div
                    className="todo-description"
                    onClick={() => toggleExpanded(todo.id)}
                  >
                    {expandedTodos.has(todo.id) ? (
                      <ReactMarkdown>{todo.description}</ReactMarkdown>
                    ) : (
                      <div className="description-preview">
                        {todo.description.split('\n')[0]}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryView; 