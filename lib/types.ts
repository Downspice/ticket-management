export type TicketPriority = "High" | "Medium" | "Low"
export type TicketStatus = "Not Started" | "In Progress" | "On Hold" | "Solved"
export type UserRole = "admin" | "technician"

export interface User {
  id: string
  fullName: string
  email: string
  roles: UserRole[]
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Ticket {
  id: number
  ticketNumber: number
  name: string
  priority: TicketPriority
  assignedToId: string | null
  assignedTo?: User
  assignedToName:string
  description: string
  status: TicketStatus
  cause?: string
  solution?: string
  holdReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateTicketData {
  name: string
  priority: string
  assignedToId: string
  assignedToName:string
  description: string
}

export interface CreateUserData {
  fullName: string
  email: string
  roles: string[]
}

export interface UpdateUserData {
  fullName: string
  email: string
  roles: string[]
  enabled: boolean
}

