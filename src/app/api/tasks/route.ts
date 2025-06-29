import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, listId, duration = "00:00" } = await request.json();

    if (!title || !listId) {
      return NextResponse.json({ error: "Title and listId are required" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify that the list belongs to the user
    const list = await prisma.list.findFirst({
      where: {
        id: listId,
        userId: user.id,
      },
    });

    if (!list) {
      return NextResponse.json({ error: "List not found or access denied" }, { status: 404 });
    }

    // Create the new task
    const newTask = await prisma.task.create({
      data: {
        name: title,
        duration: duration,
        listId: listId,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listId = searchParams.get("listId");

    if (!listId) {
      return NextResponse.json({ error: "List ID is required" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get tasks for the specified list (verify ownership)
    const tasks = await prisma.task.findMany({
      where: {
        listId: listId,
        list: {
          userId: user.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
