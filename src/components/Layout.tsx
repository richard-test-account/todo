import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const categories = [
  { name: 'To Classify', emoji: '📋' },
  { name: 'Today', emoji: '📅' },
  { name: 'Later', emoji: '⏳' },
  { name: 'Done', emoji: '✅' }
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <button className="hamburger-menu" onClick={toggleSidebar}>
        ☰
      </button>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h1 className="sidebar-title">Simple Todo</h1>
        <nav className="category-list">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/${category.name.toLowerCase().replace(' ', '-')}`}
              className={`category-link ${
                location.pathname === `/${category.name.toLowerCase().replace(' ', '-')}`
                  ? 'active'
                  : ''
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="category-emoji">{category.emoji}</span>
              {category.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout; 