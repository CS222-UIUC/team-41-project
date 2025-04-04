"use client";

import { useState, useEffect } from "react";
import SongItem from "./SongItem";
import { Song } from "@prisma/client";

export default function SongReview() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch("/api/songs");
      if (!response.ok) {
        throw new Error("Failed to fetch songs");
      }
      const data = await response.json();
      setSongs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch songs");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading songs...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-4">
        {songs.length === 0 ? (
          <div className="text-center text-gray-500">Wow, such empty</div>
        ) : (
          songs.map((song) => <SongItem key={song.id} song={song} editable={true} refreshSongs={fetchSongs} />)
        )}
      </div>
    </div>
  );
}
