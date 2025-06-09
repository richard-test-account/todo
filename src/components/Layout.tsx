import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Category } from '../types/todo';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const categories: Category[] = ['To classify', 'Today', 'Later', 'Done'];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1 className="sidebar-title">Things to do</h1>
        <nav className="category-nav">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase().replace(' ', '-')}`}
              className={`category-link ${location.pathname.includes(category.toLowerCase().replace(' ', '-')) ? 'active' : ''}`}
            >
              {category}
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