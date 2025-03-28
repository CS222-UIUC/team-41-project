"use client";

import { useEffect, useState } from "react";
import { SongCard } from "@/components/SongCard";
import { trackDatabase, TrackOption } from "@/lib/soundcloud/trackDatabase";

export default function DevPage() {
  const [selectedTrack, setSelectedTrack] = useState<TrackOption | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Randomly select a track from our database
    const randomTrack = trackDatabase[Math.floor(Math.random() * trackDatabase.length)];
    setSelectedTrack(randomTrack);
  }, []);

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!selectedTrack) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Name that Tune!</h1>
      <SongCard
        trackUrl={selectedTrack.permalink_url}
        trackTitle={selectedTrack.title}
        correctTrackId={selectedTrack.id}
      />
    </div>
  );
}
