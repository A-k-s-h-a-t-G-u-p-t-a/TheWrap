import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { completed } = await request.json();
    const taskId = params.id;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify that the task belongs to the user
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        list: {
          userId: user.id,
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found or access denied" }, { status: 404 });
    }

    // Update the task completion status
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: completed,
        completedAt: completed ? new Date() : null,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
