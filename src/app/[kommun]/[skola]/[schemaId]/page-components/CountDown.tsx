import addDaysToDate from "@/utils/addDaysToDate";
import getCurrentWeekNumber from "@/utils/getCurrentWeekNumber";
import getNextMondayIfWeekend from "@/utils/getNextMondayIfWeekend";
import removeQuotes from "@/utils/sanitize/removeQoutes";

import fetchSchedule from "../fetchSchedule";
import { FetchSchedule } from "../fetchSchedule";
import CountdownTimer from "./CountDownTimer";
import DetSerUt from "./DetSerUt";
import FelaktigtID from "@/app/[kommun]/[skola]/[schema-id]/page-components/FelaktigtID";

export interface CountDownInterface {
  komun: string;
  skola: string;
  schemaId: string;
}

interface Lesson {
  guidId: string;
  texts: string[];
  timeStart: string;
  timeEnd: string;
  dayOfWeekNumber: number;
  blockName: string;
}

interface LessonWithTimestamp extends Lesson {
  timeStartDate: Date;
  timeEndDate: Date;
}

/**
 * given a list of lessons and todays date, will determine which
 * lesson we're currently having, or the next one we will have
 *
 * here we could implement a way to handle overlapping lessons
 */
function determineCurrentOrNextLesson(
  lessons: LessonWithTimestamp[],
  todaysDate: Date,
) {
  const now = new Date(todaysDate);

  for (const lesson of lessons) {
    const startTime = new Date(lesson.timeStartDate);
    const endTime = new Date(lesson.timeEndDate);

    if (now >= startTime && now <= endTime) {
      // Current lesson found
      return { lesson, isCurrentLesson: true };
    }
  }

  // If no current lesson, find the next lesson
  const upcomingLessons = lessons.filter(
    (lesson) => new Date(lesson.timeStartDate!) > now,
  );
  upcomingLessons.sort(
    (a, b) =>
      new Date(a.timeStartDate!).getTime() -
      new Date(b.timeStartDate!).getTime(),
  );

  const nextLesson = upcomingLessons[0];

  return { lesson: nextLesson, isCurrentLesson: false };
}

/**
 * takes a list of lessons and maps js Dates objexts to them
 */
function mapDateToLessonTimes(date: Date, lessonInfo: Lesson[]) {
  const timeZoneOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds

  const mapped = lessonInfo.map((lesson) => {
    const timeStartDate = new Date(date);
    const timeEndDate = new Date(date);

    const [startHours, startMinutes, startSeconds] = lesson.timeStart
      .split(":")
      .map(Number);
    timeStartDate.setHours(startHours, startMinutes, startSeconds);
    timeStartDate.setTime(timeStartDate.getTime() - timeZoneOffset);

    const [endHours, endMinutes, endSeconds] = lesson.timeEnd
      .split(":")
      .map(Number);
    timeEndDate.setHours(endHours, endMinutes, endSeconds);
    timeEndDate.setTime(timeEndDate.getTime() - timeZoneOffset);

    return {
      ...lesson,
      timeStartDate,
      timeEndDate,
    } as LessonWithTimestamp;
  });

  return mapped;
}

/**
 * returns the schedule that matches with the paramerts.
 * if no lesson are found for the given day, it will recursively check the next and the next
 */
async function getValidSchedule(
  todaysDate: Date,
  recursionCount = 0,
  komun: string,
  skola: string,
  schemaId: string,
): Promise<
  | "couldn't find any lessons for the comming 7 days"
  | "Felaktigt ID"
  | {
      lessonInfo: Lesson[];
      scheduleDate: Date;
    }
> {
  //stops recursionCount
  if (recursionCount > 7)
    return "couldn't find any lessons for the comming 7 days";

  //define scheduleDate, the js Date from which the schedule will be taken from
  const intrementedScheduleDate = addDaysToDate(todaysDate, recursionCount);
  const scheduleDate = getNextMondayIfWeekend(intrementedScheduleDate);

  //define the options for the fetch we're gonna make
  const options: FetchSchedule = {
    schedule: { komun: komun, skola: skola, schemaId: schemaId },
    date: {
      year: intrementedScheduleDate.getFullYear(),
      week: getCurrentWeekNumber(intrementedScheduleDate),
      dayOfTheWeek: intrementedScheduleDate.getDay() || 7,
    },
  };

  //fetch using the "fetchSchedule" utility function
  const data = await fetchSchedule(options);
  if (data == "Felaktigt ID") return "Felaktigt ID";

  //if there is no lessonInfo, in other words, if there are no lessons for that day: get the nextday
  if (!("timetable" in data) || !data.timetable.data.lessonInfo) {
    return getValidSchedule(
      todaysDate,
      recursionCount + 1,
      komun,
      skola,
      schemaId,
    );
  }
  
  const lessonInfo = data.timetable.data.lessonInfo;

  //incase there are no more lessons for today, fetch the lessons for the next day
  const mappedLessonInfo = mapDateToLessonTimes(scheduleDate, lessonInfo);
  if (!determineCurrentOrNextLesson(mappedLessonInfo, todaysDate).lesson) {
    return getValidSchedule(
      todaysDate,
      recursionCount + 1,
      komun,
      skola,
      schemaId,
    );
  }
  return { lessonInfo, scheduleDate };
}

/**
 *  get todays date and adjust it based on the server time
 */
function getTodaysDate() {
  const now = new Date(); //creates new date object
  const timeOffsetInMS = now.getTimezoneOffset() * 60000;
  const todaysDate = new Date(now.getTime() - timeOffsetInMS); //corrects for the right timezon

  todaysDate.setHours(
    todaysDate.getHours() + Number(removeQuotes(process.env.ADJUST_TIME!)),
  ); //correct by .env (the server could have a different time than the swedish time)
  return todaysDate;
}

export default async function CountDown({
  komun,
  skola,
  schemaId,
}: CountDownInterface) {
  const todaysDate = getTodaysDate();

  const schedule = await getValidSchedule(
    todaysDate,
    0,
    komun,
    skola,
    schemaId,
  );

  if (schedule === "Felaktigt ID")
    return <FelaktigtID komun={komun} skola={skola} />;
  else if (schedule === "couldn't find any lessons for the comming 7 days")
    return <DetSerUt />;

  const scheduleMappedTimes = mapDateToLessonTimes(
    schedule.scheduleDate,
    schedule.lessonInfo,
  );

  const currentOrNextLesson = determineCurrentOrNextLesson(
    scheduleMappedTimes,
    todaysDate,
  );

  console.log("currentOrNextLessoncurrentOrNextLesson", currentOrNextLesson);

  return (
    <div className="w-full max-w-md text-center font-mono text-lg">
      <CountdownTimer
        isCurrentLesson={currentOrNextLesson.isCurrentLesson}
        targetDate={
          currentOrNextLesson.isCurrentLesson
            ? currentOrNextLesson.lesson?.timeEndDate!
            : currentOrNextLesson.lesson?.timeStartDate!
        }
      />
      <br />
      <div>
        {currentOrNextLesson.lesson?.texts[0] && (
          <div>
            Kurs:{" "}
            <span className="font-bold">
              {currentOrNextLesson.lesson?.texts[0]}
            </span>
          </div>
        )}{" "}
        {currentOrNextLesson.lesson?.texts[1] && (
          <div>
            Lärare:{" "}
            <span className="font-bold">
              {currentOrNextLesson.lesson?.texts[1]}
            </span>
          </div>
        )}{" "}
        {currentOrNextLesson.lesson?.texts[2] && (
          <div>
            Sal:{" "}
            <span className="font-bold">
              {currentOrNextLesson.lesson?.texts[2]}
            </span>
          </div>
        )}{" "}
      </div>
    </div>
  );
}
