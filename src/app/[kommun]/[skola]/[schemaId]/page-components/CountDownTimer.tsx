"use client";

import { usePlausible } from "next-plausible";

import React, { useState, useEffect } from "react";

import Title2 from "@/components/general/Title2";

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
  const plausible = usePlausible();
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

      //* docTitle
      const docTitleDagar = formatTimeUnit(days, "dag", "dagar");
      const docTitleTimmar = formatTimeUnit(hours, "timme", "timmar");
      const docTitleMinuter = formatTimeUnit(minutes, "minut", "minuter");
      const docTitleSekunder = formatTimeUnit(seconds, "sekund", "sekunder");
      document.title = `${docTitleDagar} ${docTitleTimmar} ${docTitleMinuter} ${docTitleSekunder} `;

      setTimeLeft({ days, hours, minutes, seconds });
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      // Additional logic for when the countdown reaches zero
    }
  };

  useEffect(() => {
    plausible("DisplayCountdown");
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
      <Title2 className="text-xl">
        {isCurrentLesson ? "Lektionen slutar om" : "Nästa lektion börjar om"}
      </Title2>
      <br />
      <div>{formatTimeUnit(timeLeft.days, "dag", "dagar")}</div>
      <div>{formatTimeUnit(timeLeft.hours, "timme", "timmar")}</div>
      <div>{formatTimeUnit(timeLeft.minutes, "minut", "minuter")}</div>
      <div>{formatTimeUnit(timeLeft.seconds, "sekund", "sekunder")}</div>
    </div>
  );
}
