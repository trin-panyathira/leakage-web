import { RequestItem, CAItem, UserInfo } from '../types'

// Mock storage for requests
let requestIdCounter = 1
const mockRequests: RequestItem[] = []

// Mock customer data
const mockCustomers = [
  {
    idCard: '1234567890123',
    accounts: [
      {
        caId: 'CA001',
        accountNumber: '1001234567',
        firstName: 'John',
        lastName: 'Doe',
        loanAmount: 500000,
        advisor: 'Advisor A',
        tel: '081-234-5678',
        currentLoanRate1st: 5.5,
        currentLoanRate2nd: 6.0,
        currentLoanRate3rd: 6.5,
      },
      {
        caId: 'CA002',
        accountNumber: '1001234568',
        firstName: 'John',
        lastName: 'Doe',
        loanAmount: 300000,
        advisor: 'Advisor B',
        tel: '081-234-5678',
        currentLoanRate1st: 5.0,
        currentLoanRate2nd: 5.5,
        currentLoanRate3rd: 6.0,
      },
    ],
  },
  {
    idCard: '9876543210987',
    accounts: [
      {
        caId: 'CA003',
        accountNumber: '2009876543',
        firstName: 'Jane',
        lastName: 'Smith',
        loanAmount: 750000,
        advisor: 'Advisor C',
        tel: '082-345-6789',
        currentLoanRate1st: 6.0,
        currentLoanRate2nd: 6.5,
        currentLoanRate3rd: 7.0,
      },
    ],
  },
  {
    idCard: '1111222233334',
    accounts: [
      {
        caId: 'CA004',
        accountNumber: '3001112222',
        firstName: 'Bob',
        lastName: 'Johnson',
        loanAmount: 1000000,
        advisor: 'Advisor D',
        tel: '083-456-7890',
        currentLoanRate1st: 5.25,
        currentLoanRate2nd: 5.75,
        currentLoanRate3rd: 6.25,
      },
    ],
  },
]

// Initialize with some sample requests
const initializeMockData = () => {
  if (mockRequests.length === 0) {
    mockRequests.push({
      id: requestIdCounter++,
      title: 'Leakage Request for CA001',
      description: 'Customer: John Doe, CA: CA001, New Loan Amount: 450000, Rates: 5.0%, 5.5%, 6.0%',
      makerId: 'sales1',
      status: 'PENDING_APPROVER',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      actions: [
        {
          at: new Date(Date.now() - 86400000).toISOString(),
          actorId: 'sales1',
          type: 'CREATE',
          note: 'Initial request created',
        },
      ],
    })

    mockRequests.push({
      id: requestIdCounter++,
      title: 'Leakage Request for CA003',
      description: 'Customer: Jane Smith, CA: CA003, New Loan Amount: 700000, Rates: 5.5%, 6.0%, 6.5%',
      makerId: 'sales1',
      status: 'APPROVED',
      approverId: 'approver1',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      actions: [
        {
          at: new Date(Date.now() - 172800000).toISOString(),
          actorId: 'sales1',
          type: 'CREATE',
          note: 'Initial request created',
        },
        {
          at: new Date(Date.now() - 86400000).toISOString(),
          actorId: 'approver1',
          type: 'APPROVE',
          note: 'Approved by approver',
        },
      ],
    })

    mockRequests.push({
      id: requestIdCounter++,
      title: 'Leakage Request for CA004',
      description: 'Customer: Bob Johnson, CA: CA004, New Loan Amount: 950000, Rates: 5.0%, 5.5%, 6.0%',
      makerId: 'sales2',
      status: 'PENDING_SUPER',
      approverId: 'approver1',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      actions: [
        {
          at: new Date(Date.now() - 259200000).toISOString(),
          actorId: 'sales2',
          type: 'CREATE',
          note: 'Initial request created',
        },
        {
          at: new Date(Date.now() - 172800000).toISOString(),
          actorId: 'approver1',
          type: 'ESCALATE',
          note: 'Escalated to super approver',
        },
      ],
    })
  }
}

initializeMockData()

export const mockApi = {
  searchByIdCard: (idCard: string): CAItem[] => {
    const customer = mockCustomers.find((c) => c.idCard === idCard)
    if (!customer) return []
    return customer.accounts.map((acc) => ({
      caId: acc.caId,
      accountNumber: acc.accountNumber,
      idCard: customer.idCard,
      firstName: acc.firstName,
      lastName: acc.lastName,
      loanAmount: acc.loanAmount,
    }))
  },

  searchByName: (firstName?: string, lastName?: string): CAItem[] => {
    const results: CAItem[] = []
    const firstNameLower = firstName?.toLowerCase().trim() || ''
    const lastNameLower = lastName?.toLowerCase().trim() || ''

    for (const customer of mockCustomers) {
      for (const account of customer.accounts) {
        const accountFirstName = account.firstName.toLowerCase()
        const accountLastName = account.lastName.toLowerCase()

        // If both search terms are empty, return all accounts
        // Otherwise, match if firstName matches (if provided) AND lastName matches (if provided)
        const firstNameMatch = !firstNameLower || accountFirstName.includes(firstNameLower)
        const lastNameMatch = !lastNameLower || accountLastName.includes(lastNameLower)

        if (firstNameMatch && lastNameMatch) {
          results.push({
            caId: account.caId,
            accountNumber: account.accountNumber,
            idCard: customer.idCard,
            firstName: account.firstName,
            lastName: account.lastName,
            loanAmount: account.loanAmount,
          })
        }
      }
    }

    return results
  },

  getUserInfo: (caId: string): UserInfo | null => {
    for (const customer of mockCustomers) {
      const account = customer.accounts.find((acc) => acc.caId === caId)
      if (account) {
        return {
          firstName: account.firstName,
          lastName: account.lastName,
          advisor: account.advisor,
          tel: account.tel,
          loanAmount: account.loanAmount,
          currentLoanRate1st: account.currentLoanRate1st,
          currentLoanRate2nd: account.currentLoanRate2nd,
          currentLoanRate3rd: account.currentLoanRate3rd,
        }
      }
    }
    return null
  },

  createLeakageRequest: (
    payload: any,
    userId: string
  ): RequestItem => {
    const { caId, userInfo, newLoanAmount, requestNewLoanRate1st, requestNewLoanRate2nd, requestNewLoanRate3rd } = payload

    // Auto-approve logic: check if all new rates are >= current rates - 0.5%
    const autoApprove =
      requestNewLoanRate1st >= userInfo.currentLoanRate1st - 0.5 &&
      requestNewLoanRate2nd >= userInfo.currentLoanRate2nd - 0.5 &&
      requestNewLoanRate3rd >= userInfo.currentLoanRate3rd - 0.5

    const now = new Date().toISOString()
    const newRequest: RequestItem = {
      id: requestIdCounter++,
      title: `Leakage Request for ${caId}`,
      description: `Customer: ${userInfo.firstName} ${userInfo.lastName}, CA: ${caId}, New Loan Amount: ${newLoanAmount}, Rates: ${requestNewLoanRate1st}%, ${requestNewLoanRate2nd}%, ${requestNewLoanRate3rd}%`,
      makerId: userId,
      status: autoApprove ? 'APPROVED' : 'PENDING_APPROVER',
      createdAt: now,
      actions: [],
    }

    if (autoApprove) {
      // Auto-approved: add CREATE_LEAKAGE and APPROVE actions
      newRequest.actions.push({
        at: now,
        actorId: userId,
        type: 'CREATE_LEAKAGE',
        note: 'Auto-approved: all new rates >= current - 0.5%',
      })
      newRequest.actions.push({
        at: now,
        actorId: userId,
        type: 'APPROVE',
        note: 'Auto-approved by system',
      })
    } else {
      // Manual approval required
      newRequest.actions.push({
        at: now,
        actorId: userId,
        type: 'CREATE_LEAKAGE',
      })
    }

    mockRequests.push(newRequest)
    return newRequest
  },

  listPendingForRole: (role: string): RequestItem[] => {
    if (role === 'approver') {
      return mockRequests.filter((r) => r.status === 'PENDING_APPROVER')
    } else if (role === 'super_approver') {
      return mockRequests.filter((r) => r.status === 'PENDING_SUPER')
    }
    return []
  },

  approveRequest: (id: number, userId: string, role: string): void => {
    const request = mockRequests.find((r) => r.id === id)
    if (!request) throw new Error('Request not found')

    if (role === 'approver' && request.status === 'PENDING_APPROVER') {
      request.status = 'APPROVED'
      request.approverId = userId
      request.actions.push({
        at: new Date().toISOString(),
        actorId: userId,
        type: 'APPROVE',
        note: 'Approved by approver',
      })
    } else if (role === 'super_approver' && request.status === 'PENDING_SUPER') {
      request.status = 'APPROVED'
      request.superApproverId = userId
      request.actions.push({
        at: new Date().toISOString(),
        actorId: userId,
        type: 'APPROVE',
        note: 'Approved by super approver',
      })
    } else {
      throw new Error('Not allowed to approve this request')
    }
  },

  rejectRequest: (id: number, userId: string, role: string): void => {
    const request = mockRequests.find((r) => r.id === id)
    if (!request) throw new Error('Request not found')

    if (
      (role === 'approver' && request.status === 'PENDING_APPROVER') ||
      (role === 'super_approver' && request.status === 'PENDING_SUPER')
    ) {
      request.status = 'REJECTED'
      if (role === 'approver') request.approverId = userId
      if (role === 'super_approver') request.superApproverId = userId
      request.actions.push({
        at: new Date().toISOString(),
        actorId: userId,
        type: 'REJECT',
        note: `Rejected by ${role}`,
      })
    } else {
      throw new Error('Not allowed to reject this request')
    }
  },

  escalateRequest: (id: number, userId: string, role: string): void => {
    const request = mockRequests.find((r) => r.id === id)
    if (!request) throw new Error('Request not found')

    if (role === 'approver' && request.status === 'PENDING_APPROVER') {
      request.status = 'PENDING_SUPER'
      request.approverId = userId
      request.actions.push({
        at: new Date().toISOString(),
        actorId: userId,
        type: 'ESCALATE',
        note: 'Escalated to super approver',
      })
    } else {
      throw new Error('Only approver can escalate pending requests')
    }
  },

  historyForUser: (userId: string, role: string): RequestItem[] => {
    return mockRequests.filter((r) => {
      const isMaker = r.makerId === userId
      const actedOn = r.actions.some((a) => a.actorId === userId)
      return isMaker || actedOn
    })
  },

  sendEmailForRequest: (id: number, userId: string, role: string): void => {
    const request = mockRequests.find((r) => r.id === id)
    if (!request) throw new Error('Request not found')
    if (role !== 'sales') throw new Error('Only sales can send email')
    if (request.status !== 'APPROVED') throw new Error('Can only send email for approved requests')

    const alreadySent = request.actions.some((a) => a.type === 'SEND_EMAIL')
    if (alreadySent) throw new Error('Email already sent for this request')

    request.actions.push({
      at: new Date().toISOString(),
      actorId: userId,
      type: 'SEND_EMAIL',
      note: 'Mock email sent to mock.operationteam.leakage@xxxxx.com',
    })
  },
}

