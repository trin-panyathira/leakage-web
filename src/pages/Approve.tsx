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
          {items.map(it => {
            return (
              <div key={it.id} className="ca-item">
                <div className="ca-details">
                  <div style={{fontWeight:'bold', fontSize:16, marginBottom:4}}>
                    #{it.id} {it.title}
                  </div>
                  <div style={{marginBottom:4}}>
                    <span style={{fontWeight:500}}>By:</span> {it.makerId}
                  </div>
                  {it.caId && (
                    <div style={{marginBottom:2}}>
                      <span style={{fontWeight:500}}>Account Number:</span> {it.caId}
                    </div>
                  )}
                  {it.firstName && (
                    <div style={{marginBottom:2}}>
                      <span style={{fontWeight:500}}>Name:</span> {it.firstName} {it.lastName || ''}
                    </div>
                  )}
                  {it.newLoanRate1st !== undefined && (
                    <div style={{marginBottom:2}}>
                      <span style={{fontWeight:500}}>New Rates:</span> {it.newLoanRate1st}%, {it.newLoanRate2nd}%, {it.newLoanRate3rd}%
                    </div>
                  )}
                  <div style={{marginTop:8, fontSize:12}} className="muted">
                    <div><span style={{fontWeight:500}}>CA ID:</span> {it.caId ?? 'N/A'}</div>
                    <div><span style={{fontWeight:500}}>Created:</span> {new Date(it.createdAt).toLocaleString()}</div>
                    <div><span style={{fontWeight:500}}>Status:</span> {it.status}</div>
                    <div><span style={{fontWeight:500}}>Actions:</span> {it.actions?.length ?? 0}</div>
                  </div>
                </div>
                <div className="row-actions">
                  <button onClick={() => {
                    // navigate to information page by dispatching a simple event handled in App
                    const navEvent = new CustomEvent('navigate-to-request', { detail: { id: it.id, item: it } })
                    window.dispatchEvent(navEvent)
                  }} className="secondary">Information</button>
                  <button onClick={async () => { await approveRequest(it.id, user!); await refresh() }} className="success">Approve</button>
                  <button onClick={async () => { await rejectRequest(it.id, user!); await refresh() }} className="danger">Reject</button>
                  {user?.role === 'approver' && (
                    <button onClick={async () => { await escalateRequest(it.id, user!); await refresh() }}>Send to Super Approver</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
} 