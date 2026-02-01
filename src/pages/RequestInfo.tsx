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
      {/* All fields as label and input, no duplication */}
      <form className="form">
        <h4 style={{marginBottom:8, marginTop:0}}>Basic Information</h4>
        <div style={{display:'flex',gap:16,marginBottom:8}}>
          <div className="form-group" style={{flex:1}}>
            <label>ID</label>
            <input value={item.id} readOnly className="readonly-input" />
          </div>
          <div className="form-group" style={{flex:1}}>
            <label>Title</label>
            <input value={item.title} readOnly className="readonly-input" />
          </div>
          <div className="form-group" style={{flex:1}}>
            <label>CA ID</label>
            <input value={item.caId ?? ''} readOnly className="readonly-input" />
          </div>
        </div>
        <div style={{display:'flex',gap:16,marginBottom:8}}>
          <div className="form-group" style={{flex:1}}>
            <label>Description</label>
            <input value={item.description} readOnly className="readonly-input" />
          </div>
          <div className="form-group" style={{flex:1}}>
            <label>Maker</label>
            <input value={item.makerId} readOnly className="readonly-input" />
          </div>
          <div className="form-group" style={{flex:1}}>
            <label>Created</label>
            <input value={new Date(item.createdAt).toLocaleString()} readOnly className="readonly-input" />
          </div>
        </div>

        <h4 style={{marginBottom:8, marginTop:16}}>Status & Approval</h4>
        <div style={{display:'flex',gap:16,marginBottom:8}}>
          <div className="form-group" style={{flex:1}}>
            <label>Status</label>
            <input value={item.status} readOnly className="readonly-input" />
          </div>
          <div className="form-group" style={{flex:1}}>
            <label>Approver</label>
            <input value={item.approverId ?? '-'} readOnly className="readonly-input" />
          </div>
          <div className="form-group" style={{flex:1}}>
            <label>Super Approver</label>
            <input value={item.superApproverId ?? '-'} readOnly className="readonly-input" />
          </div>
        </div>

        {/* Customer Information */}
        {item.firstName && (
          <>
            <h4 style={{marginBottom:8, marginTop:16}}>Customer Information</h4>
            <div style={{display:'flex',gap:16,marginBottom:8}}>
              <div className="form-group" style={{flex:1}}>
                <label>First Name</label>
                <input value={item.firstName} readOnly className="readonly-input" />
              </div>
              <div className="form-group" style={{flex:1}}>
                <label>Last Name</label>
                <input value={item.lastName ?? ''} readOnly className="readonly-input" />
              </div>
            </div>
          </>
        )}

        {/* Current Loan Details */}
        {item.currentLoanAmount !== undefined && (
          <>
            <h4 style={{marginBottom:8, marginTop:16}}>Current Loan Details</h4>
            <div style={{display:'flex',gap:16,marginBottom:8}}>
              <div className="form-group" style={{flex:1}}>
                <label>Current Loan Amount</label>
                <input value={item.currentLoanAmount ?? ''} readOnly className="readonly-input" />
              </div>
              <div className="form-group" style={{flex:1}}>
              </div>
              <div className="form-group" style={{flex:1}}>
              </div>
            </div>
            <div style={{display:'flex',gap:16,marginBottom:8}}>
              <div className="form-group" style={{flex:1}}>
                <label>Current Rate 1st (%)</label>
                <input value={item.currentLoanRate1st ?? ''} readOnly className="readonly-input" />
              </div>
              <div className="form-group" style={{flex:1}}>
                <label>Current Rate 2nd (%)</label>
                <input value={item.currentLoanRate2nd ?? ''} readOnly className="readonly-input" />
              </div>
              <div className="form-group" style={{flex:1}}>
                <label>Current Rate 3rd (%)</label>
                <input value={item.currentLoanRate3rd ?? ''} readOnly className="readonly-input" />
              </div>
            </div>
          </>
        )}

        {/* New Loan Details */}
        {item.newLoanAmount !== undefined && (
          <>
            <h4 style={{marginBottom:8, marginTop:16}}>Requested Loan Details</h4>
            <div style={{display:'flex',gap:16,marginBottom:8}}>
              <div className="form-group" style={{flex:1}}>
                <label>New Loan Amount</label>
                <input value={item.newLoanAmount ?? ''} readOnly className="readonly-input" />
              </div>
              <div className="form-group" style={{flex:1}}>
              </div>
              <div className="form-group" style={{flex:1}}>
              </div>
            </div>
            <div style={{display:'flex',gap:16,marginBottom:8}}>
              <div className="form-group" style={{flex:1}}>
                <label>Requested Rate 1st (%)</label>
                <input value={item.newLoanRate1st ?? ''} readOnly className="readonly-input" />
              </div>
              <div className="form-group" style={{flex:1}}>
                <label>Requested Rate 2nd (%)</label>
                <input value={item.newLoanRate2nd ?? ''} readOnly className="readonly-input" />
              </div>
              <div className="form-group" style={{flex:1}}>
                <label>Requested Rate 3rd (%)</label>
                <input value={item.newLoanRate3rd ?? ''} readOnly className="readonly-input" />
              </div>
            </div>
          </>
        )}
      </form>

      <h3 style={{marginTop:12}}>Actions</h3>
      <div>
        {item.actions && item.actions.length > 0 ? (
          <ul>
            {item.actions.map((a, i) => (
              <li key={i}>
                <span style={{fontWeight:500}}>{new Date(a.at).toLocaleString()}</span> — {a.actorId} — {a.type} {a.note ? `: ${a.note}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <div className="muted">No actions yet</div>
        )}
      </div>

      <div style={{marginTop:12}} className="row-actions">
        <button onClick={() => handleAction('approve')} className="success">Approve</button>
        <button onClick={() => handleAction('reject')} className="danger">Reject</button>
        {user?.role === 'approver' && (
          <button onClick={() => handleAction('escalate')}>Send to Super Approver</button>
        )}
        <button onClick={() => navigate('/approve')} className="secondary">Back</button>
      </div>
    </div>
  )
}
