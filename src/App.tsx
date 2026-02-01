import React, { useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MakeRequest } from './pages/MakeRequest'
import { Approve } from './pages/Approve'
import { History } from './pages/History'
import { Login } from './pages/Login'
import { Approved } from './pages/Approved'
import { NLeadsRequest } from './pages/NLeadsRequest'
import { useAuth } from './state/auth'
import { NavBar } from './components/NavBar'

export function App() {
  const { user, ready } = useAuth()
  const location = useLocation()
  const [sidebarVisible, setSidebarVisible] = useState(true)

  const defaultPath = user
    ? (user.role === 'sales' ? '/make-request' : '/approve')
    : '/login'

  if (!ready) {
    return <div />
  }

  return (
    <div className={`layout ${sidebarVisible ? 'sidebar-visible' : 'sidebar-collapsed'}`}>
      <aside className={`sidebar ${sidebarVisible ? '' : 'sidebar-hidden'}`}>
        <NavBar
          sidebarVisible={sidebarVisible}
          onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
        />
      </aside>
      <main className="main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/make-request"
            element={
              user?.role === 'sales' ? <MakeRequest /> : <Navigate to="/login" replace />
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
          <Route
            path="/approved"
            element={user ? <Approved /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/nleads-request"
            element={user ? <NLeadsRequest /> : <Navigate to="/login" replace />}
          />
          <Route path="/" element={<Navigate to={defaultPath} replace />} />
          <Route path="*" element={<div>Not Found. <Link to="/">Go Home</Link></div>} />
        </Routes>
      </main>
    </div>
  )
}