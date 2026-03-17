import React from "react";
import { observer } from "mobx-react-lite";
import { useGame } from "../../hooks/useGame";
import { Duck } from "../Duck";

import "./PlayArea.css";

export const PlayArea: React.FC = observer(() => {
  const { duckStore, hitDuck } = useGame();

  return (
    <div className="play-area">
      <Duck
        x={duckStore.x}
        y={duckStore.y}
        isHit={duckStore.isHit}
        animationFrame={duckStore.animationFrame}
        onClick={() => hitDuck()}
      />
    </div>
  );
});
