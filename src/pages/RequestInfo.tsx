import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../state/auth'
import { RequestItem } from '../types'
import { listPendingForRole, approveRequest, rejectRequest, escalateRequest } from '../state/requests'

export function RequestInfo() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const stateItem = (location.state as any)?.item as RequestItem | undefined
  const [item, setItem] = useState<RequestItem | null>(stateItem ?? null)
  const [loading, setLoading] = useState(!stateItem)

  useEffect(() => {
    const run = async () => {
      if (item || !user) { setLoading(false); return }
      try {
        const list = await listPendingForRole(user)
        const found = list.find(r => String(r.id) === params.id)
        if (found) setItem(found)
      } catch (err) {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [user, params.id])

  const handleAction = async (action: 'approve' | 'reject' | 'escalate') => {
    if (!user || !item) return
    try {
      if (action === 'approve') await approveRequest(item.id, user)
      if (action === 'reject') await rejectRequest(item.id, user)
      if (action === 'escalate') await escalateRequest(item.id, user)
      navigate('/approve')
    } catch (err: any) {
      alert(err.message || 'Action failed')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!item) return <div>Request not found.</div>

  return (
    <div className="card">
      <h2>Request Information</h2>
      <div style={{marginBottom:12}}>
        <strong>#{item.id}</strong> {item.title}
      </div>
      <div className="muted">{item.description}</div>
      <div style={{marginTop:8}}>
        <div><strong>Maker:</strong> {item.makerId}</div>
        <div><strong>CA:</strong> {item.caId ?? 'N/A'}</div>
        <div><strong>Created:</strong> {new Date(item.createdAt).toLocaleString()}</div>
        <div><strong>Status:</strong> {item.status}</div>
      </div>

      <h3 style={{marginTop:12}}>Actions</h3>
      <div>
        {item.actions && item.actions.length > 0 ? (
          <ul>
            {item.actions.map((a, i) => (
              <li key={i}>{a.at} — {a.actorId} — {a.type} {a.note ? `: ${a.note}` : ''}</li>
            ))}
          </ul>
        ) : (
          <div className="muted">No actions yet</div>
        )}
      </div>

      <div style={{marginTop:12}} className="row-actions">
        <button onClick={() => handleAction('approve')}>Approve</button>
        <button onClick={() => handleAction('reject')} className="danger">Reject</button>
        {user?.role === 'approver' && (
          <button onClick={() => handleAction('escalate')} className="secondary">Send to Super Approver</button>
        )}
        <button onClick={() => navigate('/approve')} className="secondary">Back</button>
      </div>
    </div>
  )
}
