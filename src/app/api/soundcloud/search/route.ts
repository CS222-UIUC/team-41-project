import { NextResponse } from "next/server";
import { SOUNDCLOUD_CLIENT_ID, SOUNDCLOUD_CLIENT_SECRET, SOUNDCLOUD_API_URL } from "@/config/constants";
import { SoundCloudTrack } from "../types";

async function getAccessToken() {
  try {
    const tokenUrl = `${SOUNDCLOUD_API_URL}/oauth2/token`;
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: SOUNDCLOUD_CLIENT_ID,
        client_secret: SOUNDCLOUD_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error("Failed to get access token");
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  if (!SOUNDCLOUD_CLIENT_ID || !SOUNDCLOUD_CLIENT_SECRET) {
    console.error("SoundCloud credentials are not set");
    return NextResponse.json({ error: "SoundCloud credentials are not configured" }, { status: 500 });
  }

  try {
    // First get an access token
    const accessToken = await getAccessToken();

    // Then make the search request with the token in the Authorization header
    const searchUrl = `${SOUNDCLOUD_API_URL}/tracks?q=${encodeURIComponent(query)}&limit=10`;
    console.log("Making search request to SoundCloud API...");

    const searchResponse = await fetch(searchUrl, {
      headers: {
        Authorization: `OAuth ${accessToken}`,
      },
    });

    console.log("Search response status:", searchResponse.status);

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error("SoundCloud API error:", {
        status: searchResponse.status,
        statusText: searchResponse.statusText,
        error: errorText,
      });

      return NextResponse.json(
        { error: `SoundCloud API error: ${searchResponse.status} - ${errorText}` },
        { status: searchResponse.status }
      );
    }

    const tracks = await searchResponse.json();
    console.log("Got search results, count:", tracks.length || 0);

    if (!tracks || tracks.length === 0) {
      return NextResponse.json({ tracks: [] });
    }

    const formattedTracks = tracks.map((track: SoundCloudTrack) => ({
      id: track.id,
      title: track.title,
      permalink_url: track.permalink_url,
      duration: track.duration,
      artwork_url: track.artwork_url,
      stream_url: track.stream_url,
    }));

    return NextResponse.json({ tracks: formattedTracks }); //
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch from SoundCloud API" },
      { status: 500 }
    );
  }
}
