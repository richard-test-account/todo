import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TodoItem } from '../types/todo';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  todos: TodoItem[];
}

const categories = [
  { id: 'to-classify', name: 'To Classify', emoji: '📋' },
  { id: 'today', name: 'Today', emoji: '📅' },
  { id: 'later', name: 'Later', emoji: '⏳' },
  { id: 'done', name: 'Done', emoji: '✅' },
];

const Layout: React.FC<LayoutProps> = ({ children, todos }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const getCategoryCount = (categoryId: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (categoryId) {
      case 'to-classify':
        return todos.filter(todo => !todo.dueDate).length;
      case 'today':
        return todos.filter(todo => 
          todo.dueDate && new Date(todo.dueDate).setHours(0, 0, 0, 0) === today.getTime()
        ).length;
      case 'later':
        return todos.filter(todo => 
          todo.dueDate && new Date(todo.dueDate) >= tomorrow
        ).length;
      case 'done':
        return todos.filter(todo => todo.completed).length;
      default:
        return 0;
    }
  };

  return (
    <div className="layout">
      <button 
        className="hamburger-button"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span className="hamburger-icon"></span>
      </button>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1>Simple Todo</h1>
          <button 
            className="close-sidebar"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav>
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/${category.name.toLowerCase()}`}
              className={`category-link ${location.pathname === `/${category.name.toLowerCase()}` ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="category-emoji">{category.emoji}</span>
              <span className="category-name">{category.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {children}
      </div>

      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
    </div>
  );
};

export default Layout; 