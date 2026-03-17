import React from "react";
import { observer } from "mobx-react-lite";
import { useGame, useGameInit } from "./hooks/";
import { PlayArea, Hud, Loader } from "./components";

import "./index.css";

const App: React.FC = observer(() => {
  useGameInit();

  const { gameStore, duckStore } = useGame();

  return (
    <div className="game-root">
      {gameStore.isConnected ? (
        <>
          <Hud
            totalHits={gameStore.totalHits}
            totalRounds={gameStore.totalRounds}
            nextRoundIn={gameStore.nextRoundIn}
            isActive={duckStore.isActive}
          />
          <PlayArea />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
});

export default App;
