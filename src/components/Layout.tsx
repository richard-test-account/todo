import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TodoItem } from '../types/todo';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  todos: TodoItem[];
}

const categories = [
  { id: 'to-classify', name: 'To classify' },
  { id: 'today', name: 'Today' },
  { id: 'later', name: 'Later' },
  { id: 'done', name: 'Done' },
];

const Layout: React.FC<LayoutProps> = ({ children, todos }) => {
  const location = useLocation();

  const getCategoryCount = (categoryId: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (categoryId) {
      case 'to-classify':
        return todos.filter(todo => !todo.dueDate).length;
      case 'today':
        return todos.filter(todo => 
          todo.dueDate && new Date(todo.dueDate).setHours(0, 0, 0, 0) === today.getTime()
        ).length;
      case 'later':
        return todos.filter(todo => 
          todo.dueDate && new Date(todo.dueDate) > today
        ).length;
      case 'done':
        return todos.filter(todo => todo.completed).length;
      default:
        return 0;
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1 className="sidebar-title">Todo App</h1>
        <nav className="category-nav">
          {categories.map((category) => {
            const count = getCategoryCount(category.id);
            return (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className={`category-link ${location.pathname === `/category/${category.id}` ? 'active' : ''}`}
              >
                <span className="category-name">{category.name}</span>
                {count > 0 && <span className="category-count">{count}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 