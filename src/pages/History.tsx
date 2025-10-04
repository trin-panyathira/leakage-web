import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../state/auth'
import { historyForUser } from '../state/requests'
import { RequestItem } from '../types'

const STATUS_OPTIONS: Array<RequestItem['status'] | 'ALL'> = [
  'ALL',
  'PENDING_APPROVER',
  'PENDING_SUPER',
  'APPROVED',
  'REJECTED',
]

export function History() {
  const { user } = useAuth()
  const [items, setItems] = useState<RequestItem[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'ALL' | RequestItem['status']>('ALL')

  useEffect(() => {
    const run = async () => {
      if (!user) return
      setItems(await historyForUser(user))
    }
    run()
  }, [user])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(it => {
      const matchesText = !q ||
        it.title.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q) ||
        String(it.id).includes(q) ||
        it.makerId.toLowerCase().includes(q)
      const matchesStatus = status === 'ALL' || it.status === status
      return matchesText && matchesStatus
    })
  }, [items, query, status])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusBadge = (status: string) => {
    return (
      <span className={`badge badge-${status.toLowerCase()}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  const getLastAction = (actions: any[]) => {
    if (actions.length === 0) return 'No actions'
    const lastAction = actions[actions.length - 1]
    return `${lastAction.type} by ${lastAction.actorId}`
  }

  return (
    <div>
      <div className="header-row">
        <h2 className="page-title">Request History</h2>
        <div className="count-pill">{filtered.length}</div>
      </div>
      <div className="toolbar">
        <input
          className="input"
          placeholder="Search by ID, title, description, maker..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select className="select" value={status} onChange={e => setStatus(e.target.value as any)}>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          <div className="empty-title">No matching items</div>
          <div className="empty-sub">Try changing your search or status filter.</div>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Maker</th>
                <th>Status</th>
                <th>Approver</th>
                <th>Super Approver</th>
                <th>Created At</th>
                <th>Last Action</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="history-row">
                  <td className="history-id">#{item.id}</td>
                  <td className="history-title">{item.title}</td>
                  <td className="history-maker">{item.makerId}</td>
                  <td className="history-status">{getStatusBadge(item.status)}</td>
                  <td className="history-approver">{item.approverId || '-'}</td>
                  <td className="history-super-approver">{item.superApproverId || '-'}</td>
                  <td className="history-date">{formatDate(item.createdAt)}</td>
                  <td className="history-last-action">{getLastAction(item.actions)}</td>
                  <td className="history-description">
                    <div className="description-text" title={item.description}>
                      {item.description.length > 100 
                        ? `${item.description.substring(0, 100)}...` 
                        : item.description
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 