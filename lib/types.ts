export type TicketPriority = "High" | "Medium" | "Low"
export type TicketStatus = "Not Started" | "In Progress" | "On Hold" | "Solved"

export interface Ticket {
  id: number
  ticketNumber: number
  name: string
  priority: TicketPriority
  creator: string
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
  creator: string
  description: string
}

