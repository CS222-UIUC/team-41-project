import { NextRequest, NextResponse } from "next/server";
import { playlists } from "../playlistsStore";

type RouteContext = {
  params: Promise<{
    playlistId: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { playlistId } = await context.params;

    console.log("playlistId: ", playlistId);

    console.log(
      "All Playlist IDs:",
      playlists.map((p) => p.id)
    );

    console.log("All Playlists:", playlists);
    if (!playlistId) {
      return NextResponse.json({ error: "Missing playlistId" }, { status: 400 });
    }

    const playlist = playlists.find((p) => p.id === playlistId);

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    return NextResponse.json(playlist);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json({ error: "Failed to fetch playlist" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { playlistId } = await context.params;
    const { song } = await request.json();

    if (!playlistId || !song) {
      return NextResponse.json({ error: "Missing playlistId or song" }, { status: 400 });
    }

    const playlist = playlists.find((p) => p.id === playlistId);

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Song added to playlist" });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    return NextResponse.json({ error: "Failed to add song to playlist" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { playlistId } = await context.params;
    const { songId } = await request.json();

    if (!playlistId || !songId) {
      return NextResponse.json({ error: "Missing playlistId or songId" }, { status: 400 });
    }

    const playlist = playlists.find((p) => p.id === playlistId);

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Song removed from playlist" });
  } catch (error) {
    console.error("Error deleting song from playlist:", error);
    return NextResponse.json({ error: "Failed to delete song from playlist" }, { status: 500 });
  }
}
