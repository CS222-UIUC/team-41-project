"use client";

import { useEffect, useState } from "react";
import MenuOption from "./MenuOption";
import AnimatedTitle from "../effects/AnimatedTitle";

interface MenuProps {
  options: string[];
  onConfirm: (option: string) => void;
}

export default function Menu({ options, onConfirm }: MenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showOptions) return; // Don't handle keys until options are shown

      if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Enter") {
        onConfirm(options[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, selectedIndex, onConfirm, showOptions]);

  return (
    <div className="w-full h-full flex flex-col gap-8 justify-center">
      <div className="relative">
        <AnimatedTitle
          text="Name that Tune! ♫"
          onComplete={() => {
            console.log("Title animation complete");
            setTimeout(() => setShowOptions(true), 500);
          }}
        />
      </div>
      {showOptions && (
        <div className="flex flex-col gap-6 ml-8">
          {options.map((option, index) => (
            <MenuOption
              key={option}
              text={option}
              isSelected={index === selectedIndex}
              delayMs={index * 200}
              className="text-4xl"
            />
          ))}
        </div>
      )}
    </div>
  );
}
