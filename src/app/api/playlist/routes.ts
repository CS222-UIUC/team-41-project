import { NextRequest, NextResponse } from "next/server";
import { Playlist } from "./types";

let playlists: Playlist[] = [];

export async function GET() {
    return NextResponse.json(playlists);
}

export async function POST(req: NextRequest) {
    try {
        const { name, userId } = await req.json();

        if (!name || !userId) {
            return NextResponse.json({ error: "Missing name or userId" }, { status: 400 });
        }

        const newPlaylist: Playlist = {
            id: crypto.randomUUID(),
            name,
            userId,
            tracks: [],
        };

        playlists.push(newPlaylist);
        return NextResponse.json(newPlaylist);
    } catch (error) {
        console.error("Error creating playlist:", error);
        return NextResponse.json({ error: "Failed to create playlist" }, { status: 500 });
    }
}
