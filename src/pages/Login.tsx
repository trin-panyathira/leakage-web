import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth'

export function Login() {
  const [name, setName] = useState('sales1')
  const [role, setRole] = useState<'sales' | 'approver' | 'super_approver'>('sales')
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ id: name, name, role })
    navigate('/history')
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="form">
        <label>
          Username
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>
          Role
          <select value={role} onChange={e => setRole(e.target.value as any)}>
            <option value="sales">Sales</option>
            <option value="approver">Approver</option>
            <option value="super_approver">Super Approver</option>
          </select>
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}