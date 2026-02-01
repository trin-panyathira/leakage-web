import { User } from '../types'
import { mockApi } from './mockData'

// Simulate network delay for more realistic demo
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

async function mockRequest(
  path: string,
  method: string,
  body: any | undefined,
  user: User
): Promise<any> {
  await delay() // Simulate network latency

  // Parse the path and route to appropriate mock function
  const url = new URL(path, 'http://localhost')
  const pathname = url.pathname

  try {
    // Customer search
    if (pathname === '/api/customers/search' && method === 'GET') {
      if (user.role !== 'sales') {
        throw new Error('Forbidden: Only sales can search customers')
      }
      const idCard = url.searchParams.get('idCard')
      if (!idCard) throw new Error('idCard parameter is required')
      return mockApi.searchByIdCard(idCard)
    }

    // Get customer info
    if (pathname.match(/^\/api\/customers\/[^/]+\/info$/) && method === 'GET') {
      if (user.role !== 'sales') {
        throw new Error('Forbidden: Only sales can view customer info')
      }
      const caId = pathname.split('/')[3]
      const userInfo = mockApi.getUserInfo(caId)
      if (!userInfo) throw new Error('Customer not found')
      return userInfo
    }

    // Create leakage request
    if (pathname === '/api/requests/leakage' && method === 'POST') {
      if (user.role !== 'sales') {
        throw new Error('Forbidden: Only sales can create requests')
      }
      return mockApi.createLeakageRequest(body, user.id)
    }

    // List pending requests
    if (pathname === '/api/requests/pending' && method === 'GET') {
      if (user.role !== 'approver' && user.role !== 'super_approver') {
        throw new Error('Forbidden: Only approver or super_approver can view pending requests')
      }
      return mockApi.listPendingForRole(user.role)
    }

    // Approve request
    if (pathname.match(/^\/api\/requests\/\d+\/approve$/) && method === 'POST') {
      const id = parseInt(pathname.split('/')[3])
      mockApi.approveRequest(id, user.id, user.role)
      return null
    }

    // Reject request
    if (pathname.match(/^\/api\/requests\/\d+\/reject$/) && method === 'POST') {
      const id = parseInt(pathname.split('/')[3])
      mockApi.rejectRequest(id, user.id, user.role)
      return null
    }

    // Escalate request
    if (pathname.match(/^\/api\/requests\/\d+\/escalate$/) && method === 'POST') {
      const id = parseInt(pathname.split('/')[3])
      mockApi.escalateRequest(id, user.id, user.role)
      return null
    }

    // Get history
    if (pathname === '/api/requests/history' && method === 'GET') {
      return mockApi.historyForUser(user.id, user.role)
    }

    // Send email
    if (pathname.match(/^\/api\/requests\/\d+\/send-email$/) && method === 'POST') {
      const id = parseInt(pathname.split('/')[3])
      mockApi.sendEmailForRequest(id, user.id, user.role)
      return null
    }

    throw new Error(`Unknown endpoint: ${method} ${pathname}`)
  } catch (error: any) {
    throw new Error(error.message || 'Mock API error')
  }
}

export const mockApiClient = {
  get: (path: string, user: User) => mockRequest(path, 'GET', undefined, user),
  post: (path: string, body: any, user: User) => mockRequest(path, 'POST', body, user),
}

