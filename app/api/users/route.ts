import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get("role")

    let users

    if (role) {
      // Filter users by role
      users = await prisma.user.findMany({
        where: {
          roles: {
            has: role,
          },
          enabled: true, // Only return enabled users when filtering by role
        },
        orderBy: {
          fullName: "asc",
        },
      })
    } else {
      // Return all users
      users = await prisma.user.findMany({
        orderBy: {
          fullName: "asc",
        },
      })
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

