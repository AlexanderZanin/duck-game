import React from "react";
import "./Duck.css";

type Props = {
  x?: number;
  y?: number;
  isHit?: boolean;
  animationFrame?: 0 | 1;
  onClick?: () => void;
};

export const Duck: React.FC<Props> = ({
  x = 0,
  y = 0,
  isHit = false,
  animationFrame = 0,
  onClick,
}) => {
  const style: React.CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    position: "absolute",
    width: 82,
    height: 64,
    transform: "translate(-50%, -50%)",
  };

  const className = `duck ${isHit ? "duck--hit" : ""} ${animationFrame === 1 ? "duck--frame1" : "duck--frame0"}`;

  return <div className={className} style={style} onClick={onClick} />;
};
