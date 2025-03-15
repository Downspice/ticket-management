"use client"

import { useState, useEffect } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import StatusColumn from "../components/status-column"
import SolvedModal from "../components/solved-modal"
import OnHoldModal from "../components/on-hold-modal"
import type { Ticket, TicketStatus } from "../lib/types"
import { updateTicketStatus } from "../lib/actions"

export default function TicketBoard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
  const [showSolvedModal, setShowSolvedModal] = useState(false)
  const [showOnHoldModal, setShowOnHoldModal] = useState(false)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tickets")
        const data = await response.json()
        setTickets(data)
      } catch (error) {
        console.error("Failed to fetch tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If dropped outside a droppable area
    if (!destination) return

    // If dropped in the same place
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const ticket = tickets.find((t) => t.id.toString() === draggableId)
    if (!ticket) return

    // Create a new status based on the destination
    const newStatus = destination.droppableId as TicketStatus

    // If moving to "Solved", show the modal
    if (newStatus === "Solved" && ticket.status !== "Solved") {
      setCurrentTicket(ticket)
      setShowSolvedModal(true)
      return
    }

    // If moving to "On Hold", show the modal
    if (newStatus === "On Hold" && ticket.status !== "On Hold") {
      setCurrentTicket(ticket)
      setShowOnHoldModal(true)
      return
    }

    // Otherwise, update the ticket status directly
    await updateTicketStatusAndRefresh(ticket.id, newStatus)
  }

  const updateTicketStatusAndRefresh = async (
    ticketId: number,
    status: TicketStatus,
    additionalData?: { cause?: string; solution?: string; holdReason?: string },
  ) => {
    try {
      await updateTicketStatus(ticketId, status, additionalData)

      // Refresh tickets
      const response = await fetch("/api/tickets")
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error("Failed to update ticket status:", error)
    }
  }

  const handleSolvedSubmit = async (cause: string, solution: string) => {
    if (!currentTicket) return

    await updateTicketStatusAndRefresh(currentTicket.id, "Solved", { cause, solution })
    setShowSolvedModal(false)
    setCurrentTicket(null)
  }

  const handleOnHoldSubmit = async (holdReason: string) => {
    if (!currentTicket) return

    await updateTicketStatusAndRefresh(currentTicket.id, "On Hold", { holdReason })
    setShowOnHoldModal(false)
    setCurrentTicket(null)
  }

  const handleModalClose = () => {
    setShowSolvedModal(false)
    setShowOnHoldModal(false)
    setCurrentTicket(null)
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading tickets...</div>
  }

  const getTicketsByStatus = (status: TicketStatus) => {
    return tickets.filter((ticket) => ticket.status === status)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <StatusColumn title="Not Started" tickets={getTicketsByStatus("Not Started")} status="Not Started" />
        <StatusColumn title="In Progress" tickets={getTicketsByStatus("In Progress")} status="In Progress" />
        <StatusColumn title="On Hold" tickets={getTicketsByStatus("On Hold")} status="On Hold" />
        <StatusColumn title="Solved" tickets={getTicketsByStatus("Solved")} status="Solved" />
      </DragDropContext>

      {showSolvedModal && currentTicket && (
        <SolvedModal ticket={currentTicket} onSubmit={handleSolvedSubmit} onClose={handleModalClose} />
      )}

      {showOnHoldModal && currentTicket && (
        <OnHoldModal ticket={currentTicket} onSubmit={handleOnHoldSubmit} onClose={handleModalClose} />
      )}
    </div>
  )
}

