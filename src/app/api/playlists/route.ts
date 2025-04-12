import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// get all playlists
export async function GET() {
  try {
    const playlists = await prisma.playlist.findMany();
    return NextResponse.json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }
}

// create new playlist
export async function POST(req: NextRequest) {
  try {
    const { name, createdBy } = await req.json();

    if (!name || !createdBy) {
      return NextResponse.json({ error: "Missing name or userId" }, { status: 400 });
    }

    const newPlaylist = await prisma.playlist.create({
      data: {
        name,
        createdBy: createdBy,
      },
    });

    return NextResponse.json(newPlaylist);
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json({ error: "Failed to create playlist" }, { status: 500 });
  }
}

// delete playlist by id
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing playlist id" }, { status: 400 });
    }

    const existingPlaylist = await prisma.playlist.findUnique({
      where: { id },
    });

    if (!existingPlaylist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    await prisma.playlist.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return NextResponse.json({ error: "Failed to delete playlist" }, { status: 500 });
  }
}
