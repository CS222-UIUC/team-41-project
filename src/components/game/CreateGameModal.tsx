"use client";

import { useState, useEffect } from "react";
import { Song } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import GameSongItem from "./GameSongItem";
import { toast } from "react-hot-toast";

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGameModal({ isOpen, onClose }: CreateGameModalProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"add" | "view">("add");

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

  const handleCreateGame = () => {
    if (selectedSongs.length < 5) {
      toast.error("Playlist needs at least 5 songs");
      return;
    }
    toast.success("Created game!");
    // TODO: Handle game creation
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none flex flex-col">
          <Dialog.Title className="m-0 text-[17px] font-medium">Create New Game</Dialog.Title>

          <div className="mt-4 relative">
            <div className="flex">
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === "add" ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("add")}
              >
                Add Songs
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === "view" ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("view")}
              >
                View Playlist ({selectedSongs.length})
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200">
              <div
                className={`absolute bottom-0 h-[2px] bg-blue-500 transition-all duration-300 ease-in-out ${
                  activeTab === "add" ? "w-1/2 left-0" : "w-1/2 left-1/2"
                }`}
              />
            </div>
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg outline-blue-500"
            />
          </div>

          <div className="mt-4 flex-1 min-h-0">
            {activeTab === "add" ? (
              <div className="h-full overflow-y-auto pr-2">
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
            ) : (
              <div className="h-full overflow-y-auto pr-2">
                {selectedSongs.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No songs selected yet</div>
                ) : (
                  <div className="space-y-2">
                    {selectedSongs.map((song) => (
                      <GameSongItem
                        key={song.id}
                        song={song}
                        onRemove={() => handleSongRemove(song.id)}
                        isSelected={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Cancel
              </button>
            </Dialog.Close>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              onClick={handleCreateGame}
            >
              Create Game
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-gray-100 focus:shadow-[0_0_0_2px] focus:shadow-gray-400 focus:outline-none"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
