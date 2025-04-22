"use client";

import { useState } from "react";
import Menu from "@/components/menu/Menu";
import MenuSidePanel from "@/components/menu/MenuSidePanel";
import ScrollingBackground from "@/components/background/ScrollingBackground";
import { Canvas } from "@react-three/fiber";
import FlatRecord from "@/components/3d/FlatRecord";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<string>("Start Game");
  const [showPanel, setShowPanel] = useState<boolean>(false);

  const menuOptions = ["Start Game", "How to Play", "Settings", "Credits"];

  const handleConfirm = (option: string) => {
    setSelectedOption(option);
    if (option !== "Start Game") {
      setShowPanel(true);
    }
  };

  return (
    <div className="min-h-screen flex">
      <ScrollingBackground />
      <div className="w-full h-full px-4 py-8 flex flex-row items-center justify-center">
        <div className="w-1/2">
          <Menu options={menuOptions} onConfirm={handleConfirm} />
        </div>
        <div className="flex justify-center items-center">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }} style={{ width: "550px", height: "550px" }}>
            <ambientLight intensity={1} />
            <FlatRecord />
          </Canvas>
          <MenuSidePanel
            title={selectedOption}
            content={<div>Content</div>}
            isOpen={showPanel}
            onClose={() => setShowPanel(false)}
          />
        </div>
      </div>
    </div>
  );
}
