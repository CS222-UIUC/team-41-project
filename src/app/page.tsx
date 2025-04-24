"use client";

import MenuScreen from "@/components/menu/MenuScreen";
import LobbyScreen from "@/components/game/LobbyScreen";
import GameScreen from "@/components/game/GameScreen";
import useGameStore from "@/stores/gameStore";

export default function Home() {
  const currentScreen = useGameStore((state) => state.currentScreen);

  return (
    <div>
      {currentScreen === "menu" && <MenuScreen />}
      {currentScreen === "lobby" && <LobbyScreen />}
      {currentScreen === "game" && <GameScreen />}
    </div>
  );
}
