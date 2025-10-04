import { User } from '../types'

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

export const api = {
  get: (path: string, user: User) => request(path, 'GET', undefined, user),
  post: (path: string, body: any, user: User) => request(path, 'POST', body, user),
} 