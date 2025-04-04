"use client";

import { useEffect, useState } from "react";
import { SongCard } from "@/components/SongCard";
import { trackDatabase } from "@/lib/soundcloud/trackDatabase";
import { SoundCloudTrack } from "../api/soundcloud/types";
import { Dropdown } from "@/components/ui/Dropdown";

export default function DevPage() {
  const [selectedTrack, setSelectedTrack] = useState<SoundCloudTrack | null>(null);

  useEffect(() => {
    // Randomly select a track from our database
    const randomTrack = trackDatabase[Math.floor(Math.random() * trackDatabase.length)];
    setSelectedTrack(randomTrack);
  }, []);

  const handleTrackSelect = (option: { id: number; title: string }) => {
    const selectedTrack = trackDatabase.find((track) => track.id === option.id);
    if (selectedTrack) {
      setSelectedTrack(selectedTrack);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Name that Tune!</h1>
      <div className="mb-6">
        <Dropdown
          options={trackDatabase.map((track) => ({ id: track.id, title: track.title }))}
          onSelect={handleTrackSelect}
          placeholder="Select a song..."
        />
      </div>
      {selectedTrack ? (
        <SongCard trackUrl={selectedTrack.permalink_url} trackTitle={selectedTrack.title} />
      ) : (
        <div className="p-4">Select a song from the dropdown above</div>
      )}
    </div>
  );
}
