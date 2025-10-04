import { api } from '../api/client'
import { RequestItem, User, CAItem, UserInfo, LeakageRequest } from '../types'

export async function createRequest(
  payload: { title: string; description: string },
  user: User
): Promise<RequestItem> {
  const res = await api.post('/api/requests', payload, user)
  return res as RequestItem
}

export async function listPendingForRole(user: User): Promise<RequestItem[]> {
  const res = await api.get(`/api/requests/pending`, user)
  return res as RequestItem[]
}

export async function approveRequest(id: number, user: User): Promise<void> {
  await api.post(`/api/requests/${id}/approve`, {}, user)
}

export async function rejectRequest(id: number, user: User): Promise<void> {
  await api.post(`/api/requests/${id}/reject`, {}, user)
}

export async function escalateRequest(id: number, user: User): Promise<void> {
  await api.post(`/api/requests/${id}/escalate`, {}, user)
}

export async function historyForUser(user: User): Promise<RequestItem[]> {
  const res = await api.get(`/api/requests/history`, user)
  return res as RequestItem[]
}

// New API functions for the updated workflow
export async function searchByIdCard(idCard: string, user: User): Promise<CAItem[]> {
  const res = await api.get(`/api/customers/search?idCard=${idCard}`, user)
  return res as CAItem[]
}

export async function getUserInfo(caId: string, user: User): Promise<UserInfo> {
  const res = await api.get(`/api/customers/${caId}/info`, user)
  return res as UserInfo
}

export async function createLeakageRequest(
  payload: LeakageRequest & { caId: string; userInfo: UserInfo },
  user: User
): Promise<RequestItem> {
  const res = await api.post('/api/requests/leakage', payload, user)
  return res as RequestItem
} 