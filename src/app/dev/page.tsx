"use client";

import { useEffect, useState } from "react";
import { SongCard } from "@/components/SongCard";

interface Track {
  id: number;
  title: string;
  permalink_url: string;
  duration: number;
}

export default function DevPage() {
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string>("");

  const testSongs = ["Viva La Vida Coldplay", "Shape of You Ed Sheeran", "Riptide Vance Joy"];

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch(
          `/api/soundcloud/search?q=${testSongs[Math.floor(Math.random() * testSongs.length)]}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch song");
        }

        if (!data.tracks || data.tracks.length === 0) {
          throw new Error("No tracks found");
        }

        // Get the first track from search results
        setTrack(data.tracks[0]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch song";
        setError(errorMessage);
        console.error(err);
      }
    };

    fetchSong();
  }, []);

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!track) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dev Page</h1>
      <SongCard trackUrl={track.permalink_url} trackTitle={track.title} />
    </div>
  );
}
