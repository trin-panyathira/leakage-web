import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Role, User } from '../types'

interface AuthContextState {
  user: User | null
  ready: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('leakage_user')
    if (raw) setUser(JSON.parse(raw))
    setReady(true)
  }, [])

  const login = (u: User) => {
    setUser(u)
    localStorage.setItem('leakage_user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('leakage_user')
  }

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('AuthProvider missing')
  return ctx
} 