import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// get all game sessions
export async function GET() {
    try {
        const sessions = await prisma.gameSession.findMany({
            include: {
                user: true,
                playlist: true,
            },
            orderBy: { startedAt: "desc" },
        });
        return NextResponse.json(sessions);
    } catch (error) {
        console.error("Error fetching game sessions:", error);
        return NextResponse.json({ error: "Failed to fetch game sessions" }, { status: 500 });
    }
}

// start new game session
export async function POST(req: NextRequest) {
    try {
        const { userId, playlistId } = await req.json();

        if (!userId || !playlistId) {
            return NextResponse.json({ error: "Missing userId or playlistId" }, { status: 400 });
        }

        const session = await prisma.gameSession.create({
            data: {
                userId,
                playlistId,
            },
        });

        return NextResponse.json(session);
    } catch (error) {
        console.error("Error starting game session:", error);
        return NextResponse.json({ error: "Failed to start game session" }, { status: 500 });
    }
}
