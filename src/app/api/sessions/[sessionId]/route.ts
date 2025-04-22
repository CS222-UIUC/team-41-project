import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// session by sessionId
export async function GET(request: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await context.params;

    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
        playlist: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}

// PATCH to end a session
export async function PATCH(req: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await context.params;
    const { score, correct, totalGuesses } = await req.json();

    if (typeof score !== "number" || typeof correct !== "number" || typeof totalGuesses !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const session = await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        score,
        correct,
        totalGuesses,
      },
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: {
        totalPoints: { increment: score },
        totalGames: { increment: 1 },
        correctGuesses: { increment: correct },
        gamesWon: score > 0 ? { increment: 1 } : undefined,
        averageTime: {
          increment: (new Date().getTime() - new Date(session.startedAt).getTime()) / 1000,
        },
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error ending session:", error);
    return NextResponse.json({ error: "Failed to end session" }, { status: 500 });
  }
}
