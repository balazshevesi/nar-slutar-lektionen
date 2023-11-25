"use client";
import Bread from "@/app/components/Bread";
import { json } from "stream/consumers";
import { useEffect } from "react";
import { useState } from "react";

import logic from "./logic";
import fetchSchedule from "./fetchSchedule";
import { FetchSchedule } from "./fetchSchedule";

import getCurrentWeekNumber from "@/app/utils/getCurrentWeekNumber";

import CountdownTimer from "./countDownTimer";

export default function Page({
  params,
}: {
  params: { kommun: string; skola: string; "schema-id": string };
}) {
  const komun = params.kommun;
  const skola = params.skola;
  const schemaId = params["schema-id"];

  const [schedule, setSchedule] = useState<any>();

  useEffect(() => {
    const currentDate = new Date();
    let dayOfTheWeek = currentDate.getDay();
    let dayOfTheWeekAdjusted = currentDate.getDay() === 0 ? 7 : dayOfTheWeek;
    let week = getCurrentWeekNumber(currentDate);
    let year = currentDate.getFullYear();

    //! unhandled edge case: new year
    if (dayOfTheWeekAdjusted > 5) {
      dayOfTheWeekAdjusted = 1;
      week++;
    }

    const options: FetchSchedule = {
      schedule: { komun, skola, schemaId },
      date: {
        year: year,
        week: week,
        dayOfTheWeek: dayOfTheWeekAdjusted,
      },
    };

    fetchSchedule(options).then((data) => {
      logic(data.timetable.data.lessonInfo, options, false, 0, setSchedule);
    });
  }, []);

  return (
    <div className="flex h-[100dvh] flex-col items-center p-8">
      <Bread kommun={komun} skola={skola} schemaId={schemaId} />
      <h2 className="mb-2 text-lg font-medium">{schemaId}</h2>
      <h3>
        {schedule
          ? !schedule.isActiveLesson && (
              <>
                <div className=" text-center text-2xl font-semibold">
                  <CountdownTimer
                    timeUntilStart={Math.abs(schedule.timeUntilStart)}
                  />
                </div>
                <div>Kurs: {schedule.nextLesson.texts[0]}</div>
                <div>Lärare: {schedule.nextLesson.texts[1]}</div>
                <div>Sal: {schedule.nextLesson.texts[2]}</div>
              </>
            )
          : "laddar..."}
      </h3>
    </div>
  );
}
