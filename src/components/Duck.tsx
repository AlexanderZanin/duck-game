import React from "react";

type Props = {
  x?: number;
  y?: number;
  isHit?: boolean;
  animationFrame?: number;
};

export const Duck: React.FC<Props> = ({ x = 0, y = 0, isHit = false }) => {
  return (
    <div
      className={`duck ${isHit ? "duck--hit" : ""}`}
      style={{ left: `${x}%`, top: `${y}%`, position: "absolute" }}
    >
      Duck
    </div>
  );
};
