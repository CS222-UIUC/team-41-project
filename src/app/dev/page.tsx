"use client";

import { useEffect, useState } from "react";
import { SongCard } from "@/components/game/SongCard";
import { trackDatabase } from "@/lib/soundcloud/trackDatabase";
import { SoundCloudTrack } from "../api/soundcloud/types";
import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";

export default function DevPage() {
  const [secretTrack, setSecretTrack] = useState<SoundCloudTrack | null>(null);
  const [userGuess, setUserGuess] = useState<SoundCloudTrack | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [givenUp, setGivenUp] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    selectRandomTrack();
  }, []);

  const selectRandomTrack = () => {
    const randomTrack = trackDatabase[Math.floor(Math.random() * trackDatabase.length)];
    setSecretTrack(randomTrack);
    setUserGuess(null);
    setIsCorrect(null);
    setGameOver(false);
    setGivenUp(false);
    setAttempts(0);
  };

  const handleTrackSelect = (option: { id: string; title: string }) => {
    const selectedTrack = trackDatabase.find((track) => track.id === option.id);
    if (selectedTrack) {
      setUserGuess(selectedTrack);
    }
  };

  const checkGuess = () => {
    if (userGuess && secretTrack) {
      const correct = userGuess.id === secretTrack.id;
      setIsCorrect(correct);
      setAttempts((prev) => prev + 1);

      if (correct) {
        setGameOver(true);
      } else {
        setUserGuess(null);
      }
    }
  };

  const handleGiveUp = () => {
    setGivenUp(true);
    setGameOver(true);
  };

  const playAgain = () => {
    selectRandomTrack();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold text-center">Name that Tune!</h1>
      </header>

      <main className="flex-1 flex flex-col p-4">
        {secretTrack && (
          <div className="flex-1 flex items-center justify-center mb-8">
            <SongCard
              trackUrl={secretTrack.permalinkUrl} // Updated from permalink_url
              trackTitle={gameOver && (isCorrect || givenUp) ? secretTrack.title : "Mystery Song"}
            />
          </div>
        )}

        <div className="w-full max-w-2xl mx-auto space-y-4 mb-8">
          {!gameOver && (
            <>
              <div className="font-medium text-lg">
                Make your guess:
                {attempts > 0 && <span className="text-gray-600 ml-2">Attempts: {attempts}</span>}
              </div>
              <Dropdown
                options={trackDatabase.map((track) => ({ id: track.id, title: track.title }))}
                onSelect={handleTrackSelect}
                placeholder="Select a song..."
                value={userGuess ? { id: userGuess.id, title: userGuess.title } : null}
              />

              <div className="flex space-x-4">
                <Button
                  onClick={checkGuess}
                  disabled={!userGuess}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors py-2 text-lg font-medium"
                >
                  Submit Guess
                </Button>

                {attempts > 0 && (
                  <Button
                    onClick={handleGiveUp}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white transition-colors py-2 text-lg font-medium"
                  >
                    Give Up
                  </Button>
                )}
              </div>
            </>
          )}

          {isCorrect === true && gameOver && (
            <div className="p-6 rounded-lg text-center shadow-lg bg-green-100 border-2 border-green-300">
              <div className="font-bold text-xl mb-2">You got it right! 🎉</div>
              <div className="text-lg">
                The song was: <span className="font-semibold">{secretTrack?.title}</span>
              </div>
              <div className="text-gray-600 mt-1">Attempts: {attempts}</div>
              <Button
                onClick={playAgain}
                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white transition-colors py-2 px-8 text-lg font-medium"
              >
                Play Again
              </Button>
            </div>
          )}

          {isCorrect === false && !gameOver && (
            <div className="p-4 rounded-lg text-center bg-red-100 border-2 border-red-300">
              <div className="font-bold text-lg">Not quite! 😔 Try again!</div>
            </div>
          )}

          {givenUp && gameOver && (
            <div className="p-6 rounded-lg text-center shadow-lg bg-orange-100 border-2 border-orange-300">
              <div className="font-bold text-xl mb-2">Better luck next time!</div>
              <div className="text-lg">
                The song was: <span className="font-semibold">{secretTrack?.title}</span>
              </div>
              <div className="text-gray-600 mt-1">Attempts: {attempts}</div>
              <Button
                onClick={playAgain}
                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white transition-colors py-2 px-8 text-lg font-medium"
              >
                Play Again
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
