import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Failed to fetch tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

