import React from "react";
import { observer } from "mobx-react-lite";
import { useGame } from "./hooks/useGame";
import { PlayArea, Hud, Loader } from "./components";

import "./index.css";

const App: React.FC = observer(() => {
  const { gameStore } = useGame();

  return (
    <div className="game-root">
      {gameStore.isConnected ? (
        <>
          <Hud
            totalHits={gameStore.totalHits}
            totalRounds={gameStore.totalRounds}
            nextRoundIn={gameStore.nextRoundIn}
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
