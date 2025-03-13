"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { CreateTicketData, TicketStatus } from "@/lib/types"

export async function createTicket(data: CreateTicketData) {
  try {
    // Get the highest ticket number to generate the next one
    const highestTicket = await prisma.ticket.findFirst({
      orderBy: {
        ticketNumber: "desc",
      },
    })

    const nextTicketNumber = highestTicket ? highestTicket.ticketNumber + 1 : 1001

    // Create the new ticket
    await prisma.ticket.create({
      data: {
        ticketNumber: nextTicketNumber,
        name: data.name,
        priority: data.priority,
        creator: data.creator,
        description: data.description,
        status: "Not Started",
      },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to create ticket:", error)
    throw new Error("Failed to create ticket")
  }
}

export async function updateTicketStatus(
  ticketId: number,
  status: TicketStatus,
  additionalData?: { cause?: string; solution?: string; holdReason?: string },
) {
  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status,
        ...(additionalData?.cause && { cause: additionalData.cause }),
        ...(additionalData?.solution && { solution: additionalData.solution }),
        ...(additionalData?.holdReason && { holdReason: additionalData.holdReason }),
      },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update ticket status:", error)
    throw new Error("Failed to update ticket status")
  }
}

