export type Role = 'maker' | 'approver' | 'super_approver'

export interface User {
  id: string
  name: string
  role: Role
}

export interface RequestItem {
  id: number
  title: string
  description: string
  makerId: string
  status: 'PENDING_APPROVER' | 'PENDING_SUPER' | 'APPROVED' | 'REJECTED'
  approverId?: string
  superApproverId?: string
  createdAt: string
  actions: Action[]
}

export interface Action {
  at: string
  actorId: string
  type: string
  note?: string
}

export interface CAItem {
  caId: string
  firstName: string
  lastName: string
  loanAmount: number
}

export interface UserInfo {
  firstName: string
  lastName: string
  advisor: string
  tel: string
  loanAmount: number
  currentLoanRate1st: number
  currentLoanRate2nd: number
  currentLoanRate3rd: number
}

export interface LeakageRequest {
  newLoanAmount: number
  requestNewLoanRate1st: number
  requestNewLoanRate2nd: number
  requestNewLoanRate3rd: number
} 