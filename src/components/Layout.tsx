import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const categories = [
  { id: 'to-classify', name: 'To classify' },
  { id: 'today', name: 'Today' },
  { id: 'later', name: 'Later' },
  { id: 'done', name: 'Done' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1 className="sidebar-title">Todo App</h1>
        <nav className="category-nav">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={`category-link ${location.pathname === `/category/${category.id}` ? 'active' : ''}`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 