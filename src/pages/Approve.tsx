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
      <div className="section">
        {items.length === 0 && <p>No pending items.</p>}
        <div className="ca-list">
          {items.map(it => (
            <div key={it.id} className="ca-item">
              <div className="ca-details">
                <div><strong>#{it.id}</strong> {it.title} – by {it.makerId}</div>
                <div className="muted">{it.description}</div>
                <div style={{marginTop:8, fontSize:12}} className="muted">
                  <div>CA: {it.caId ?? 'N/A'}</div>
                  <div>Created: {new Date(it.createdAt).toLocaleString()}</div>
                  <div>Status: {it.status}</div>
                  <div>Actions: {it.actions?.length ?? 0}</div>
                </div>
              </div>
              <div className="row-actions">
                <button onClick={async () => { await approveRequest(it.id, user!); await refresh() }}>Approve</button>
                <button onClick={async () => { await rejectRequest(it.id, user!); await refresh() }} className="danger">Reject</button>
                {user?.role === 'approver' && (
                  <button onClick={async () => { await escalateRequest(it.id, user!); await refresh() }} className="secondary">Send to Super Approver</button>
                )}
                <button onClick={() => {
                  // navigate to information page by dispatching a simple event handled in App
                  const navEvent = new CustomEvent('navigate-to-request', { detail: { id: it.id, item: it } })
                  window.dispatchEvent(navEvent)
                }} className="secondary">Information</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 