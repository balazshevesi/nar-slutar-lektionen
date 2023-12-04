"use client";

import React, { useState, useEffect } from "react";

import { metadataGlobal } from "../../../../../metadata";

// import { metadata } from "../layout";
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

  const formatTimeUnit = (unit: number, singular: string, plural: string) => {
    if (unit > 0) {
      return unit + (unit > 1 ? ` ${plural}` : ` ${singular}`);
    }
    return "";
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const timeOffsetInMS = now.getTimezoneOffset() * 60000;
    const nowAdjusted = new Date(now.getTime() - timeOffsetInMS);
    const difference = targetDate.getTime() - nowAdjusted.getTime();

    //* refresh window
    if (!Math.round(difference / 1000))
      setInterval(() => document.location.reload(), 1000);

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      document.title = `${formatTimeUnit(
        days,
        "dag",
        "dagar",
      )} ${formatTimeUnit(hours, "timme", "timmar")} ${formatTimeUnit(
        minutes,
        "minut",
        "minuter",
      )} ${formatTimeUnit(minutes, "minut", "minuter")} ${formatTimeUnit(
        seconds,
        "sekund",
        "sekunder",
      )}`;

      setTimeLeft({ days, hours, minutes, seconds });
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      // Additional logic for when the countdown reaches zero
    }
  };

  useEffect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => {
      //reset docTitle on unmount, could also be done in a template.tsx file tho
      document.title = "" + metadataGlobal.title!;
      return clearInterval(interval);
    };
  }, [targetDate]);

  return (
    <div>
      <h2 className=" text-xl">
        {isCurrentLesson ? "Lektionen slutar om" : "Nästa lektion börjar om"}
      </h2>
      <br />
      <div>{formatTimeUnit(timeLeft.days, "dag", "dagar")}</div>
      <div>{formatTimeUnit(timeLeft.hours, "timme", "timmar")}</div>
      <div>{formatTimeUnit(timeLeft.minutes, "minut", "minuter")}</div>
      <div>{formatTimeUnit(timeLeft.seconds, "sekund", "sekunder")}</div>
    </div>
  );
}
