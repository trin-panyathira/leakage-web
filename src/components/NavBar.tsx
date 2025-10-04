import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../state/auth'

export function NavBar() {
  const { user, logout } = useAuth()

  return (
    <nav className="sidebar-nav">
      <div className="brand">Leakage</div>
      <div className="menu">
        {user?.role === 'maker' && <Link to="/make-request" className="menu-link">Make Request</Link>}
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
  )
} 