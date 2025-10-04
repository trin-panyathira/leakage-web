import { useEffect, useState } from 'react'
import { listPendingForRole, approveRequest, rejectRequest, escalateRequest } from '../state/requests'
import { useAuth } from '../state/auth'
import { RequestItem } from '../types'

export function Approve() {
  const { user } = useAuth()
  const [items, setItems] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      if (!user) return
      const list = await listPendingForRole(user)
      setItems(list)
      setLoading(false)
    }
    run()
  }, [user])

  const refresh = async () => {
    if (!user) return
    setItems(await listPendingForRole(user))
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="card">
      <h2>Approve Requests</h2>
      {items.length === 0 && <p>No pending items.</p>}
      {items.map(it => (
        <div key={it.id} className="row">
          <div>
            <strong>#{it.id}</strong> {it.title} – by {it.makerId}
            <div className="muted">{it.description}</div>
          </div>
          <div className="row-actions">
            <button onClick={async () => { await approveRequest(it.id, user!); await refresh() }}>Approve</button>
            <button onClick={async () => { await rejectRequest(it.id, user!); await refresh() }} className="danger">Reject</button>
            {user?.role === 'approver' && (
              <button onClick={async () => { await escalateRequest(it.id, user!); await refresh() }} className="secondary">Send to Super Approver</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 