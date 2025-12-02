import React, { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="main-header">
        <div className="logo">Сервисы</div>
        <nav className="nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            end
          >
            Главная
          </NavLink>
          <NavLink 
            to="/wizards" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Wizards
          </NavLink>
          <NavLink 
            to="/fruits" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Fruits
          </NavLink>
          <NavLink 
            to="/holidays" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Holidays
          </NavLink>
        </nav>
      </header>

      <main>
        {children}
      </main>

      <footer>
        <p>2025<br />Cute Programmers</p>
      </footer>
    </div>
  )
}

export default Layout