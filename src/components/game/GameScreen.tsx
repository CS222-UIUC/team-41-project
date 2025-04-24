"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import useGameStore from "@/stores/gameStore";
import { usePusher } from "@/hooks/usePusher";
import { SongCard } from "./SongCard";
import { Playlist, Song } from "@prisma/client";
import { getAllSongs } from "@/services/songService";

interface PlaylistWithSongs extends Playlist {
  songs: Song[];
}

export default function GameScreen() {
  const session = useGameStore((state) => state.session);
  const setScreen = useGameStore((state) => state.setScreen);

  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [userGuess, setUserGuess] = useState<Song | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [givenUp, setGivenUp] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [usedSongIds, setUsedSongIds] = useState<Set<string>>(new Set());

  // Listen for game start event
  usePusher(`session-${session?.id}`, "gameStarted", () => {
    toast.success("Game started!");
    setScreen("game");
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songs = await getAllSongs();
        setAllSongs(songs);
        if (session?.playlist) {
          selectRandomTrack();
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load songs:", err);
        toast.error("Failed to load songs");
        setIsLoading(false);
      }
    };

    if (isClient) {
      fetchSongs();
    }
  }, [isClient, session?.playlist]);

  const selectRandomTrack = () => {
    if (!session?.playlist) return;

    const playlistWithSongs = session.playlist as PlaylistWithSongs;
    if (!playlistWithSongs.songs || playlistWithSongs.songs.length === 0) {
      toast.error("No songs in playlist");
      return;
    }

    // Filter out used songs
    const availableSongs = playlistWithSongs.songs.filter((song) => !usedSongIds.has(song.id));

    if (availableSongs.length === 0) {
      toast.success("You've completed all songs in the playlist!");
      setScreen("menu");
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const randomTrack = availableSongs[randomIndex];
    setCurrentTrack(randomTrack as Song);
    setUsedSongIds((prev) => new Set(prev).add(randomTrack.id));
    setUserGuess(null);
    setIsCorrect(null);
    setGameOver(false);
    setGivenUp(false);
    setAttempts(0);
  };

  const handleGuess = (song: Song) => {
    setUserGuess(song as Song);
    checkGuess();
  };

  const checkGuess = () => {
    if (userGuess && currentTrack) {
      const correct = userGuess.id === currentTrack.id;
      setIsCorrect(correct);
      setAttempts((prev) => prev + 1);

      if (correct) {
        setGameOver(true);
        toast.success("Correct! 🎉", {
          duration: 2000,
          position: "top-center",
          style: {
            background: "#4CAF50",
            color: "white",
            fontSize: "1.1rem",
          },
        });
        // Update player score
        if (session) {
          fetch(`/api/sessions/${session.id}/guess`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              correct: true,
              trackId: currentTrack.id,
            }),
          });
        }
      } else {
        toast.error("Not quite! Try again!", {
          duration: 2000,
          position: "top-center",
          style: {
            background: "#f44336",
            color: "white",
            fontSize: "1.1rem",
          },
        });
        setUserGuess(null);
      }
    }
  };

  const handleNextSong = () => {
    if (!gameOver) {
      // First click - reveal the answer
      setGivenUp(true);
      setGameOver(true);
      toast("Skipped song!", {
        duration: 2000,
        position: "top-center",
        style: {
          background: "#FF9800",
          color: "white",
          fontSize: "1.1rem",
        },
      });
    } else {
      // Second click - go to next song
      selectRandomTrack();
    }
  };

  if (!session || !session.playlist || !isClient) {
    return null;
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading game...</div>;
  }

  if (allSongs.length === 0) {
    return <div className="text-center p-4">No songs available</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col p-4">
        {currentTrack && (
          <div className="flex-1 flex items-center justify-center mb-8">
            <SongCard
              trackUrl={currentTrack.permalinkUrl || ""}
              trackTitle={currentTrack.title}
              artistName={currentTrack.artist || "Unknown Artist"}
              songs={allSongs}
              onGuess={handleGuess}
              onGiveUp={handleNextSong}
              attempts={attempts}
              status={
                !gameOver && isCorrect === null && !givenUp ? "guessing" : isCorrect === true ? "correct" : "incorrect"
              }
            />
          </div>
        )}
      </main>
    </div>
  );
}
