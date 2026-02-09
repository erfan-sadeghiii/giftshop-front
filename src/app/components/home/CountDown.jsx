"use client";

import React, { useEffect, useState } from "react";

export default function Countdown({ createdAt, duration }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!createdAt || !duration) return;

    // Parse createdAt safely — JS handles timezone offsets automatically
    const createdTime = new Date(createdAt).getTime();

    // duration is in seconds; convert to milliseconds
    const endTime = createdTime + duration * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(Math.floor((endTime - now) / 1000), 0);
      setTimeLeft(diff);
    };

    // Initial call
    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [createdAt, duration]);

  // Convert seconds to HH:MM:SS
  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-x-2">
      <span className="timer-box">{seconds}</span>
      <p className="text-white">:</p>
      <span className="timer-box">{minutes}</span>
      <p className="text-white">:</p>
      <span className="timer-box">{hours}</span>
    </div>
  );
}
