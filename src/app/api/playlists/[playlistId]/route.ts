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
    const { track } = await request.json();

    if (!playlistId || !track) {
      return NextResponse.json({ error: "Missing playlistId or track" }, { status: 400 });
    }

    const playlist = playlists.find((p) => p.id === playlistId);

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const isDuplicate = playlist.tracks.some((t) => t.id === track.id);
    if (isDuplicate) {
      return NextResponse.json({ error: "Track already exists in the playlist" }, { status: 400 });
    }

    playlist.tracks.push(track);

    return NextResponse.json(playlist);
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    return NextResponse.json({ error: "Failed to add track to playlist" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { playlistId } = await context.params;
    const { trackId } = await request.json();

    if (!playlistId || !trackId) {
      return NextResponse.json({ error: "Missing playlistId or trackId" }, { status: 400 });
    }

    const playlist = playlists.find((p) => p.id === playlistId);

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const trackIndex = playlist.tracks.findIndex((t) => t.id === trackId);

    if (trackIndex === -1) {
      return NextResponse.json({ error: "Track not found in the playlist" }, { status: 404 });
    }

    playlist.tracks.splice(trackIndex, 1);

    return NextResponse.json(playlist);
  } catch (error) {
    console.error("Error deleting track from playlist:", error);
    return NextResponse.json({ error: "Failed to delete track from playlist" }, { status: 500 });
  }
}
