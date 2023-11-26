"use client";
import React, { useState, useEffect } from "react";

interface CountDownProps {
  targetDate: Date;
  isCurrentLesson: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({
  targetDate,
  isCurrentLesson,
}: CountDownProps) {
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
        // setTimeLeft("Time reached!");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTimeUnit = (unit: number, singular: string, plural: string) => {
    if (unit > 0) {
      return <div>{unit + (unit > 1 ? ` ${plural}` : ` ${singular}`)}</div>;
    }
    return null;
  };

  return (
    <div>
      <h2 className=" text-xl">
        {isCurrentLesson ? "Lektionen slutar om" : "Nästa lektion börjar om"}
      </h2>
      <br />
      {formatTimeUnit(timeLeft.days, "dag", "dagar")}
      {formatTimeUnit(timeLeft.hours, "timme", "timmar")}
      {formatTimeUnit(timeLeft.minutes, "minut", "minuter")}
      {formatTimeUnit(timeLeft.seconds, "sekund", "sekunder")}
    </div>
  );
}
