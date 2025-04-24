"use client";

import { useState, useEffect } from "react";
import { Song } from "@prisma/client";
import Modal from "../ui/Modal";
import GameSongItem from "../game/GameSongItem";
import { toast } from "react-hot-toast";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePlaylistModal({ isOpen, onClose }: CreatePlaylistModalProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch("/api/songs?status=approved");
      if (!response.ok) throw new Error("Failed to fetch songs");
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSongs = songs
    .filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleSongSelect = (song: Song) => {
    if (!selectedSongs.some((s) => s.id === song.id)) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleSongRemove = (songId: string) => {
    setSelectedSongs(selectedSongs.filter((song) => song.id !== songId));
  };

  const handleCreatePlaylist = async () => {
    if (selectedSongs.length < 5) {
      toast.error("Playlist needs at least 5 songs");
      return;
    }

    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "My Playlist",
          songs: selectedSongs.map((song) => song.id),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create playlist");
      }

      toast.success("Playlist created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast.error("Failed to create playlist");
    }
  };

  return (
    <Modal title="Create New Playlist" isOpen={isOpen} onClose={onClose} className="h-[85vh] w-[90vw] max-w-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex-none space-y-4">
          <input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg outline-blue-500"
          />
        </div>

        <div className="flex-1 min-h-0 overflow-hidden mt-2">
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="text-center">Loading songs...</div>
            ) : (
              <div className="space-y-2">
                {filteredSongs.map((song) => (
                  <GameSongItem
                    key={song.id}
                    song={song}
                    onAdd={() => handleSongSelect(song)}
                    onRemove={() => handleSongRemove(song.id)}
                    isSelected={selectedSongs.some((s) => s.id === song.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-none pt-4 mt-4">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              onClick={handleCreatePlaylist}
            >
              Create Playlist
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
