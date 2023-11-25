"use client";
import { ucs2 } from "punycode";
import React, { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: Date;
  isCurrentLesson: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownProps> = ({
  targetDate,
  isCurrentLesson,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeOffsetInMS = now.getTimezoneOffset() * 60000;
      const nowAdjusted = new Date(now.getTime() - timeOffsetInMS);

      const difference = targetDate.getTime() - nowAdjusted.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        // setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        clearInterval(interval);
        setTimeLeft("Time reached!");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className=" font-mono">
      <h2>
        {isCurrentLesson ? "Lektionen slutar om" : "Nästa lektion börjar om"}
      </h2>
      <div>{timeLeft.days && timeLeft.days} dagar</div>
      <div>{timeLeft.hours && timeLeft.hours} timmar</div>
      <div>{timeLeft.minutes && timeLeft.minutes} minuter</div>
      <div>{timeLeft.seconds && timeLeft.seconds} sekunder</div>
    </div>
  );
};

export default CountdownTimer;
