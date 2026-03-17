import React, { useState, useEffect } from "react";
import "./Hud.css";

type Props = {
  totalHits: number;
  totalRounds: number;
  nextRoundIn: number;
};

export const Hud: React.FC<Props> = ({
  totalHits,
  totalRounds,
  nextRoundIn,
}) => {
  const [countdown, setCountdown] = useState(Math.round(nextRoundIn / 1000));

  useEffect(() => {
    setCountdown(Math.round(nextRoundIn / 1000));
  }, [nextRoundIn]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="hud">
      <div className="hud__info">
        <div className="hud__item">Hits: {totalHits}</div>
        <div className="hud__item">Rounds: {totalRounds}</div>
      </div>
      <div className="hud__info">
        <div className="hud__item">Next Round In: {countdown}s</div>
      </div>
    </div>
  );
};
