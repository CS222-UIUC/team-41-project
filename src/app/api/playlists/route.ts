import { NextRequest, NextResponse } from "next/server";
import { playlists } from "./playlistsStore";
import { Playlist } from "@prisma/client";

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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    playlists.push(newPlaylist);
    return NextResponse.json(newPlaylist);
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json({ error: "Failed to create playlist" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing playlist id" }, { status: 400 });
    }

    const playlistIndex = playlists.findIndex((playlist) => playlist.id === id);

    if (playlistIndex === -1) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    playlists.splice(playlistIndex, 1);
    return NextResponse.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return NextResponse.json({ error: "Failed to delete playlist" }, { status: 500 });
  }
}
