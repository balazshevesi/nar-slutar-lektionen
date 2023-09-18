"use client";
import moment from "moment";
import Image from "next/image";
import axios from "axios";
import { useRef, useState, useEffect, useMemo } from "react";

//helper
function getWeekNumber(d: any) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

async function getSchedule(
  scheduleId: string,
  setState: Function,
  date?: Date,
  weekOfTheYear?: number,
  dayOfTheWeek?: number,
  isNextDay?: boolean
) {
  date = date || new Date();
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
        // If it is already fetching for the next day, stop further recursive calls
        setState(result);
        return;
      }

      // Increment the day and check if it goes beyond the week
      dayOfTheWeek += 1;
      if (dayOfTheWeek > 6) {
        dayOfTheWeek = 0;
        weekOfTheYear += 1;

        // Check if it goes beyond the year
        if (weekOfTheYear > 52) {
          weekOfTheYear = 1;
          year += 1;
        }
      }

      // Set the new date to check the correct week number
      date = new Date(year, 0, 1);
      date.setDate(date.getDate() + (weekOfTheYear - 1) * 7 + dayOfTheWeek);
      weekOfTheYear = getWeekNumber(date);

      // Recursive call with updated date values
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
    // Handle error appropriately here, potentially with a retry logic
  }
}

//helper
function noMoreLessonsToday(lessons: Array<any>, currentTime: Date) {
  return (
    findCurrentLesson(lessons, currentTime) === undefined &&
    findNextLesson(lessons, currentTime) === undefined
  );
}

function findCurrentLesson(lessons: Array<any>, currentTime: Date) {
  const currentLesson = lessons.find((lesson) => {
    const timeStart = new Date(`2023-09-18T${lesson.timeStart}`);
    const timeEnd = new Date(`2023-09-18T${lesson.timeEnd}`);
    return currentTime >= timeStart && currentTime <= timeEnd;
  });

  return currentLesson ? currentLesson : undefined;
}

function findNextLesson(lessons: Array<any>, currentTime: Date) {
  // Format the current time to 'YYYY-MM-DD' format
  const currentDate = currentTime.toISOString().split("T")[0];

  const dayOfWeek = ((currentTime.getDay() + 6) % 7) + 1;

  //if the lessons are from tomorrow
  //console.log("wjfiowejfuwejhfiow", lessons[0].dayOfWeekNumber, dayOfWeek);
  let lessonsAreFromTomorrow: any = false;
  if (lessons[0].dayOfWeekNumber === dayOfWeek + 1) {
    lessonsAreFromTomorrow = true;
  }

  // Sort the lessons by start time
  const sortedLessons = lessons.sort((a, b) => {
    const startA = new Date(`${currentDate}T${a.timeStart}`);
    const startB = new Date(`${currentDate}T${b.timeStart}`);
    return startA.getTime() - startB.getTime();
  });

  // Find the next lesson
  const nextLesson = sortedLessons.find((lesson) => {
    const timeStart = new Date(`${currentDate}T${lesson.timeStart}`);

    if (lessonsAreFromTomorrow) {
      return currentTime < new Date(timeStart.setDate(timeStart.getDate() + 1));
    }
    return currentTime < timeStart;
  });

  return nextLesson ? nextLesson : undefined;
}

export default function Home() {
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date());
  const [timeLeftOfOrTilLesson, setTimeLeftOfLesson] = useState(0);

  const inputIdFieldRef = useRef(null);

  const currentLesson = useMemo(() => {
    if (schedule.length !== 0) {
      const returnValue = findCurrentLesson(schedule, date);
      return returnValue;
    }
  }, [date, schedule]);

  const nextLesson = useMemo(() => {
    if (schedule.length !== 0) {
      if (findNextLesson(schedule, date) === undefined) {
        console.log("this will be undeff");
        console.log(date);
        console.log(schedule);
      }
      return findNextLesson(schedule, date);
    }
  }, [date, schedule]);

  useEffect(() => {
    if (schedule.length !== 0) {
      let lessonTime;
      if (currentLesson === undefined) {
        lessonTime = moment(`2023-09-18T${nextLesson.timeStart}`);
      } else {
        lessonTime = moment(`2023-09-18T${currentLesson.timeEnd}`);
      }
      const now = moment(date);

      const duration = moment.duration(lessonTime.diff(now));
      const minutes = duration.asMinutes().toFixed(2);

      setTimeLeftOfLesson(minutes);
    }
  }, [date, schedule]);

  useEffect(() => {
    const timerID = setInterval(() => {
      let date = new Date();
      setDate(date);
    }, 1000);
    return () => {
      clearInterval(timerID);
    };
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
          getSchedule(inputIdFieldRef.current.value, setSchedule, date);
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
      <span className="text-[12rem] font-bold">
        {Math.abs(timeLeftOfOrTilLesson)}
      </span>
      <span className=" font-extrabold text-2xl">minuter</span>
    </div>
  );
}
