import React from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MakeRequest } from './pages/MakeRequest'
import { Approve } from './pages/Approve'
import { History } from './pages/History'
import { Login } from './pages/Login'
import { useAuth } from './state/auth'
import { NavBar } from './components/NavBar'

export function App() {
  const { user, ready } = useAuth()
  const location = useLocation()

  const defaultPath = user
    ? (user.role === 'maker' ? '/make-request' : '/approve')
    : '/login'

  if (!ready) {
    return <div />
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <NavBar />
      </aside>
      <main className="main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/make-request"
            element={
              user?.role === 'maker' ? <MakeRequest /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/approve"
            element={
              user?.role === 'approver' || user?.role === 'super_approver' ? (
                <Approve />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/history"
            element={user ? <History /> : <Navigate to="/login" replace />}
          />
          <Route path="/" element={<Navigate to={defaultPath} replace />} />
          <Route path="*" element={<div>Not Found. <Link to="/">Go Home</Link></div>} />
        </Routes>
      </main>
    </div>
  )
} 