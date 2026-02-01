import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../state/auth'

interface NavBarProps {
  sidebarVisible: boolean
  onToggleSidebar: () => void
}

export function NavBar({ sidebarVisible, onToggleSidebar }: NavBarProps) {
  const { user, logout } = useAuth()

  return (
    <>
      <nav className="sidebar-nav">
        <div className="brand-container">
          <div className="brand">Leakage</div>
          <button
            className={`sidebar-toggle ${sidebarVisible ? 'active' : ''}`}
            onClick={onToggleSidebar}
            title={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
            aria-label={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarVisible ? '«' : '»'}
          </button>
        </div>
        <div className="menu">
          {user?.role === 'sales' && <Link to="/make-request" className="menu-link">Make Request</Link>}
          {(user?.role === 'approver' || user?.role === 'super_approver') && (
            <Link to="/approve" className="menu-link">Approve</Link>
          )}
          {user && <Link to="/history" className="menu-link">History</Link>}
        </div>
        <div className="spacer" />
        <div className="auth auth-vertical">
          {user ? (
            <>
              <div className="user">{user.name} ({user.role})</div>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="menu-link">Login</Link>
          )}
        </div>
      </nav>
    </>
  )
}