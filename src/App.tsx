import React from "react";
import { observer } from "mobx-react-lite";
import { useGame } from "./hooks/useGame";
import { Duck } from "./components/Duck";
import { Hud } from "./components/Hud";
import { Loader } from "./components/Loader";

import "./index.css";

const App: React.FC = observer(() => {
  const { gameStore, duckStore, hitDuck } = useGame();

  return (
    <div className="game-root">
      {gameStore.isConnected ? (
        <>
          <Hud
            totalHits={gameStore.totalHits}
            totalRounds={gameStore.totalRounds}
            nextRoundIn={gameStore.nextRoundIn}
          />
          <div className="play-area">
            <Duck
              x={duckStore.x}
              y={duckStore.y}
              isHit={duckStore.isHit}
              animationFrame={duckStore.animationFrame}
              onClick={() => hitDuck()}
            />
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
});

export default App;
