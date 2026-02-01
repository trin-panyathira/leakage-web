import { User } from '../types'
import { mockApiClient } from './mockClient'

// Toggle this flag to switch between mock and real API
const USE_MOCK_API = false

async function request(path: string, method: string, body: any | undefined, user: User) {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': user.id,
      'x-user-role': user.role,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text)
  }
  if (res.status === 204) return null
  return await res.json()
}

const realApi = {
  get: (path: string, user: User) => request(path, 'GET', undefined, user),
  post: (path: string, body: any, user: User) => request(path, 'POST', body, user),
}

// Export either mock or real API based on the flag
export const api = USE_MOCK_API ? mockApiClient : realApi