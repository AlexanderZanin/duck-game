import React from "react";
import "./Hud.css";

type Props = {
  totalHits: number;
  totalRounds: number;
};

export const Hud: React.FC<Props> = ({ totalHits, totalRounds }) => {
  return <div className="hud">{`${totalHits}/${totalRounds}`}</div>;
};
