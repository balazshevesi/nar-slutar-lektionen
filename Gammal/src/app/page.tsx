"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import axios from "axios";
import moment from "moment";

// Helper function to get the week number
function getWeekNumber(d: Date) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return weekNo;
}

async function getSchedule(
  scheduleId: string,
  setState: Function,
  date: Date = new Date(),
  weekOfTheYear?: number,
  dayOfTheWeek?: number,
  isNextDay?: boolean
) {
  let year = date.getFullYear();
  weekOfTheYear = weekOfTheYear || getWeekNumber(date);
  dayOfTheWeek = dayOfTheWeek || date.getDay();

  try {
    const response = await axios.post("api/getSchedule", {
      scheduleId,
      year,
      weekOfTheYear,
      dayOfTheWeek,
    });
    const result = response.data.data.lessonInfo;

    if (noMoreLessonsToday(result, date)) {
      if (isNextDay) {
        setState(result);
        return;
      }

      dayOfTheWeek += 1;
      if (dayOfTheWeek > 6) {
        dayOfTheWeek = 0;
        weekOfTheYear += 1;
        if (weekOfTheYear > 52) {
          weekOfTheYear = 1;
          year += 1;
        }
      }

      date = new Date(year, 0, 1);
      date.setDate(date.getDate() + (weekOfTheYear - 1) * 7 + dayOfTheWeek);
      weekOfTheYear = getWeekNumber(date);

      getSchedule(
        scheduleId,
        setState,
        date,
        weekOfTheYear,
        dayOfTheWeek,
        true
      );
    } else {
      setState(result);
    }
  } catch (error) {
    console.error("Error fetching schedule:", error);
  }
}

function noMoreLessonsToday(lessons: Array<any>, currentTime: Date) {
  return (
    findCurrentLesson(lessons, currentTime) === undefined &&
    findNextLesson(lessons, currentTime) === undefined
  );
}

function findCurrentLesson(lessons: Array<any>, currentTime: Date) {
  const currentDate = currentTime.toISOString().split("T")[0];
  const currentLesson = lessons.find((lesson) => {
    const timeStart = new Date(`${currentDate}T${lesson.timeStart}`);
    const timeEnd = new Date(`${currentDate}T${lesson.timeEnd}`);
    return currentTime >= timeStart && currentTime <= timeEnd;
  });

  return currentLesson ? currentLesson : undefined;
}

function findNextLesson(lessons: Array<any>, currentTime: Date) {
  const currentDate = currentTime.toISOString().split("T")[0];
  const dayOfWeek = ((currentTime.getDay() + 6) % 7) + 1;

  let lessonsAreFromTomorrow = false;
  if (lessons[0] && lessons[0].dayOfWeekNumber === dayOfWeek + 1) {
    lessonsAreFromTomorrow = true;
  }

  const sortedLessons = lessons.sort((a, b) => {
    const startA = new Date(`${currentDate}T${a.timeStart}`);
    const startB = new Date(`${currentDate}T${b.timeStart}`);
    return startA.getTime() - startB.getTime();
  });

  const nextLesson = sortedLessons.find((lesson) => {
    const timeStart = new Date(`${currentDate}T${lesson.timeStart}`);
    if (lessonsAreFromTomorrow) {
      timeStart.setDate(timeStart.getDate() + 1);
    }
    return currentTime < timeStart;
  });

  return nextLesson ? nextLesson : undefined;
}

export default function Home() {
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date());
  const [timeLeftOfOrTilLesson, setTimeLeftOfLesson] = useState(0);

  const inputIdFieldRef = useRef<HTMLInputElement>(null);

  const currentLesson = useMemo(
    () => findCurrentLesson(schedule, date),
    [date, schedule]
  );
  const nextLesson = useMemo(
    () => findNextLesson(schedule, date),
    [date, schedule]
  );

  useEffect(() => {
    if (schedule.length !== 0) {
      let lessonTime;
      if (currentLesson === undefined) {
        lessonTime = moment(
          `${date.toISOString().split("T")[0]}T${nextLesson.timeStart}`
        );
      } else {
        lessonTime = moment(
          `${date.toISOString().split("T")[0]}T${currentLesson.timeEnd}`
        );
      }
      const now = moment(date);

      const duration = moment.duration(lessonTime.diff(now));
      const minutes = parseFloat(duration.asMinutes().toFixed(2));

      setTimeLeftOfLesson(minutes);
    }
  }, [date, schedule]);

  useEffect(() => {
    const timerID = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div>skola: haganässkolan</div>
      <label htmlFor="schema-id">schema-id</label>
      <input
        ref={inputIdFieldRef}
        id="schema-id"
        type="text"
        className="bg-zinc-300"
      />
      <button
        onClick={() => {
          if (inputIdFieldRef.current) {
            getSchedule(inputIdFieldRef.current.value, setSchedule, date);
          }
        }}
        className="bg-sky-400 px-4 py-2 font-semibold text-white rounded-xl"
      >
        Spara
      </button>
      <span className=" font-extrabold text-2xl">
        {currentLesson === undefined
          ? "nästa lektion börjar om:"
          : "lektionen slutar om:"}
      </span>
      <span className="text-[6rem] font-bold">
        {Math.abs(parseFloat(String(timeLeftOfOrTilLesson)))}
      </span>
      <span className=" font-extrabold text-2xl">minuter</span>
    </div>
  );
}
