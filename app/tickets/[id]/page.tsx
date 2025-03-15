"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import type { Ticket, User } from "../../../lib/types"
import { updateTicketAssignee } from "../../../lib/actions"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../../components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "../../../lib/utils"

export default function TicketDetailPage() {
  const router = useRouter()
  const params=useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [technicians, setTechnicians] = useState<User[]>([])
  const [open, setOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")

  

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch ticket")
        const data = await response.json()
        setTicket(data)
        setSelectedUserId(data.assignedToId || "")
      } catch (error) {
        console.error("Error fetching ticket:", error)
      } finally {
        setLoading(false)
      }
    }

    const fetchTechnicians = async () => {
      try {
        const response = await fetch("/api/users?role=technician")
        if (!response.ok) throw new Error("Failed to fetch technicians")
        const data = await response.json()
        setTechnicians(data)
      } catch (error) {
        console.error("Error fetching technicians:", error)
      }
    }

    fetchTicket()
    fetchTechnicians()
  }, [params.id])

  const handleAssigneeChange = async (userId: string,userName: string,) => {
    if (!ticket) return

    try {
      // Update local state 
      setSelectedUserId(userId)
      await updateTicketAssignee(ticket.id, userId,userName)
      
      // Refresh the ticket data
      const response = await fetch(`/api/tickets/${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch updated ticket")
      const data = await response.json()
      setTicket(data)
    } catch (error) {
      console.error("Error updating assignee:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <p>Loading ticket details...</p>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center">
          <p className="mb-4">Ticket not found</p>
          <Button asChild>
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full ${getPriorityColor(ticket.priority)}`} />
              <CardTitle>
                Ticket #{ticket.ticketNumber}: {ticket.name}
              </CardTitle>
            </div>
            <div
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor:
                  ticket.status === "Not Started"
                    ? "rgba(59, 130, 246, 0.1)"
                    : ticket.status === "In Progress"
                      ? "rgba(245, 158, 11, 0.1)"
                      : ticket.status === "On Hold"
                        ? "rgba(139, 92, 246, 0.1)"
                        : "rgba(34, 197, 94, 0.1)",
                color:
                  ticket.status === "Not Started"
                    ? "rgb(37, 99, 235)"
                    : ticket.status === "In Progress"
                      ? "rgb(217, 119, 6)"
                      : ticket.status === "On Hold"
                        ? "rgb(124, 58, 237)"
                        : "rgb(22, 163, 74)",
              }}
            >
              {ticket.status}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
              <p>{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
              <p>{new Date(ticket.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned To</h3>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button 
                disabled={ticket.status == "Solved"} variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                  {selectedUserId
                    ? technicians.find((user) => user.id === selectedUserId)?.fullName || "Select technician"
                    : "Select technician"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search technician..." />
                  <CommandList>
                    <CommandEmpty>No technician found.</CommandEmpty>
                    <CommandGroup>
                      {technicians.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.fullName}
                          onSelect={() => {
                            handleAssigneeChange(user.id,user.fullName)
                            
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", selectedUserId === user.id ? "opacity-100" : "opacity-0")}
                          />
                          {user.fullName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.status === "Solved" && (
            <>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Cause</h3>
                <p className="whitespace-pre-wrap">{ticket.cause || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Solution</h3>
                <p className="whitespace-pre-wrap">{ticket.solution || "Not specified"}</p>
              </div>
            </>
          )}

          {ticket.status === "On Hold" && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Reason for Hold</h3>
              <p className="whitespace-pre-wrap">{ticket.holdReason || "Not specified"}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

