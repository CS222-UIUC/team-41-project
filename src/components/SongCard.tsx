"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Play, Pause, Plus } from "@phosphor-icons/react";

interface SongCardProps {
  trackUrl: string;
  trackTitle: string;
}

export function SongCard({ trackUrl, trackTitle }: SongCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [clipDuration, setClipDuration] = useState(2); // Start with 2 seconds
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    // Reset player state when the track changes
    setIsPlaying(false);
    setProgress(0);
    setClipDuration(2); // Reset clip duration back to default 2 seconds
    clearInterval(progressInterval.current);
    
    // Choose a random start time for the song clip
    const duration = 180; // Assume 3 minutes song length
    setStartTime(Math.floor(Math.random() * (duration - 5))); // Max 5 second clip
  }, [trackUrl]);

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

  return (
    <div className="w-full max-w-4xl p-8 border-2 border-blue-200 rounded-xl shadow-xl bg-white space-y-6">
      {/* Song title display with animated background */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-pink-600 py-10 px-6">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                animation: `pulse ${Math.random() * 3 + 2}s infinite`
              }}
            />
          ))}
        </div>
        <h2 className="text-3xl font-bold text-center text-white tracking-wide">
          {trackTitle}
        </h2>
      </div>
      
      {/* Hidden embed player */}
      <div className="w-0 h-0 overflow-hidden">
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

      <div className="space-y-4">
        {/* Progress bar with animated gradient */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-100" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Playback controls */}
        <div className="flex gap-3 items-center">
          <Button 
            onClick={handlePlay} 
            disabled={isPlaying} 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-3 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            {isPlaying ? 
              <Pause className="w-6 h-6" /> : 
              <Play className="w-6 h-6" />
            }
            <span className="ml-2">{clipDuration}s clip</span>
          </Button>
          
          <Button 
            onClick={handleAddSecond} 
            disabled={isPlaying || clipDuration >= 5} 
            className="p-3 bg-pink-600 hover:bg-pink-700 text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-md"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        {/* Clip duration indicator */}
        <div className="text-center text-gray-600 mt-2">
          <span className="font-medium">Maximum clip duration: {clipDuration} seconds</span>
          {clipDuration < 5 && (
            <span className="text-xs text-blue-600 ml-2">(Click + to add more time)</span>
          )}
        </div>
      </div>

      {/* Music equalizer visualization */}
      <div className="flex justify-center items-end h-12 gap-1 mt-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i}
            className="w-2 bg-gradient-to-t from-blue-600 to-pink-500 rounded-t transition-all duration-500"
            style={{ 
              height: isPlaying ? `${Math.random() * 80 + 20}%` : "10%",
              animationDelay: `${i * 0.1}s` 
            }}
          />
        ))}
      </div>
    </div>
  );
}