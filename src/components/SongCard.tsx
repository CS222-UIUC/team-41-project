"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Play, Pause, Plus } from "@phosphor-icons/react";
import { trackDatabase, TrackOption } from "@/lib/soundcloud/trackDatabase";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";

interface SongCardProps {
  trackUrl: string;
  trackTitle: string;
  correctTrackId: number;
}

export function SongCard({ trackUrl, trackTitle, correctTrackId }: SongCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackOption | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [clipDuration, setClipDuration] = useState(2);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval>>();
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    const duration = 180; // Assume 3 minutes song length
    setStartTime(Math.floor(Math.random() * (duration - 5))); // Max 5 second clip
  }, []);

  const handlePlay = () => {
    if (playerRef.current) {
      const widget = window.SC.Widget(playerRef.current);

      widget.bind(window.SC.Widget.Events.READY, () => {
        widget.seekTo(startTime * 1000);
        widget.play();
        setIsPlaying(true);
        setProgress(0);

        // Start progress update
        progressInterval.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(progressInterval.current);
              return 100;
            }
            return prev + 100 / clipDuration / 10; // Update 10 times per second
          });
        }, 100);

        // Stop after specified duration
        setTimeout(() => {
          widget.pause();
          setIsPlaying(false);
          clearInterval(progressInterval.current);
          setProgress(100);
        }, clipDuration * 1000);
      });
    }
  };

  const handleAddSecond = () => {
    if (clipDuration < 5) {
      setClipDuration((prev) => prev + 1);
    }
  };

  const handleGuess = () => {
    if (!selectedTrack) return;
    
    const correct = selectedTrack.id === correctTrackId;
    setIsCorrect(correct);
    if (correct) {
      setShowSolution(true);
    }
  };

  const handleGiveUp = () => {
    setShowSolution(true);
    setIsCorrect(false);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md space-y-4">
      {/* Hidden embed player*/}
      <div className={showSolution ? "w-full h-20" : "w-0 h-0 overflow-hidden"}>
        <iframe
          ref={playerRef}
          width="100%"
          height="100%"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${trackUrl}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true`}
        />
      </div>

      <div className="space-y-2">
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>

        {/* Playback controls */}
        <div className="flex gap-2 items-center">
          <Button onClick={handlePlay} disabled={isPlaying} className="flex-1" variant="outline">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span className="ml-2">{clipDuration}s clip</span>
          </Button>
          <Button onClick={handleAddSecond} disabled={isPlaying || clipDuration >= 5} variant="outline" size="icon">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-between">
                {selectedTrack ? selectedTrack.title : "Select a song..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search songs..." />
                <CommandEmpty>No song found.</CommandEmpty>
                <CommandGroup>
                  {trackDatabase.map((track) => (
                    <CommandItem
                      key={track.id}
                      onSelect={() => {
                        setSelectedTrack(track);
                        setOpen(false);
                      }}
                    >
                      {track.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Button onClick={handleGuess} disabled={!selectedTrack}>
            Submit
          </Button>
        </div>

        {!showSolution && (
          <Button onClick={handleGiveUp} variant="outline" className="w-full mt-2">
            Give Up
          </Button>
        )}

        {isCorrect !== null && (
          <div className="text-center space-y-2">
            <div className={`font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "Correct!" : "Try again!"}
            </div>
            {showSolution && <div className="text-sm text-gray-600">The song was: {trackTitle}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
