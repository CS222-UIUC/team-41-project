"use client";

import { useState } from "react";
import Menu from "@/components/menu/Menu";
import MenuSidePanel from "@/components/menu/MenuSidePanel";
import StartGameModal from "@/components/menu/StartGameModal";
import ScrollingBackground from "@/components/background/ScrollingBackground";
import { Canvas } from "@react-three/fiber";
import FlatRecord from "@/components/3d/FlatRecord";

export default function MenuScreen() {
  const [selectedOption, setSelectedOption] = useState<string>("Start Game");
  const [showSidePanel, setShowSidePanel] = useState<boolean>(false);
  const [showStartGameModal, setShowStartGameModal] = useState<boolean>(false);
  const menuOptions = ["Start Game", "How to Play", "Settings", "Credits"];

  const handleConfirm = (option: string) => {
    setSelectedOption(option);
    setShowSidePanel(option !== "Start Game");
    setShowStartGameModal(option === "Start Game");
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
            isOpen={showSidePanel}
            onClose={() => setShowSidePanel(false)}
          />
        </div>
        <StartGameModal isOpen={showStartGameModal} setIsOpen={setShowStartGameModal} />
      </div>
    </div>
  );
}
