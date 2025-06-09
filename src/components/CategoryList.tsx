import React from 'react';
import { TodoItem, Category, CategoryGroup } from '../types/todo';
import './CategoryList.css';

interface CategoryListProps {
  todos: TodoItem[];
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onUpdateDueDate: (id: number, date: Date) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onUpdateDueDate,
}) => {
  const getCategoryGroups = (): CategoryGroup[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const groups: CategoryGroup[] = [
      { name: 'To classify', todos: [] },
      { name: 'Today', todos: [] },
      { name: 'Later', todos: [] },
    ];

    todos.forEach((todo) => {
      if (!todo.dueDate) {
        groups[0].todos.push(todo);
      } else {
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate.getTime() === today.getTime()) {
          groups[1].todos.push(todo);
        } else if (dueDate > today) {
          groups[2].todos.push(todo);
        }
      }
    });

    return groups;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDateChange = (id: number, dateString: string) => {
    const date = new Date(dateString);
    onUpdateDueDate(id, date);
  };

  return (
    <div className="category-list">
      {getCategoryGroups().map((group) => (
        <div key={group.name} className="category-group">
          <h2 className="category-title">{group.name}</h2>
          {group.todos.length === 0 ? (
            <p className="empty-message">No tasks in this category</p>
          ) : (
            <ul className="todo-list">
              {group.todos.map((todo) => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleTodo(todo.id)}
                    className="todo-checkbox"
                  />
                  <span className="todo-text">{todo.text}</span>
                  <input
                    type="date"
                    value={todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange(todo.id, e.target.value)}
                    className="todo-date"
                  />
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
      ))}
    </div>
  );
};

export default CategoryList; 