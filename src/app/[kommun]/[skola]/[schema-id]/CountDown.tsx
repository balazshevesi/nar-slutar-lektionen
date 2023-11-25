import fetchSchedule from "./fetchSchedule";
import { FetchSchedule } from "./fetchSchedule";
import getCurrentWeekNumber from "@/app/utils/getCurrentWeekNumber";
import getNextMondayIfWeekend from "@/app/api/utils/getNextMondayIfWeekend";
import addDaysToDate from "@/app/api/utils/addDaysToDate";
import CountdownTimer from "../../../components/CountDownTimer";

interface CountDown {
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
  timeStartDate?: Date;
  timeEndDate?: Date;
}

function getCurrentOrNextLesson(lessons: Lesson[], todaysDate: Date) {
  const now = new Date(todaysDate);

  for (const lesson of lessons) {
    const startTime = new Date(lesson.timeStartDate!);
    const endTime = new Date(lesson.timeEndDate!);

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

  const nextLesson = upcomingLessons.length > 0 ? upcomingLessons[0] : null;

  return { lesson: nextLesson, isCurrentLesson: false };
}

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
    };
  });

  return mapped;
}

export default async function CountDown({ komun, skola, schemaId }: CountDown) {
  const now = new Date();
  const timeOffsetInMS = now.getTimezoneOffset() * 60000;
  const todaysDate = new Date(now.getTime() - timeOffsetInMS);

  async function getValidSchedule(todaysDate: Date, recursionCount = 0) {
    if (recursionCount > 7) {
      throw new Error("recursionCount went above 7");
    }
    const scheduleDate = getNextMondayIfWeekend(todaysDate);
    const intrementedScheduleDate = addDaysToDate(scheduleDate, recursionCount);
    const options: FetchSchedule = {
      schedule: { komun: komun, skola: skola, schemaId: schemaId },
      date: {
        year: intrementedScheduleDate.getFullYear(),
        week: getCurrentWeekNumber(intrementedScheduleDate),
        dayOfTheWeek: intrementedScheduleDate.getDay() || 7,
      },
    };
    const response = await fetchSchedule(options);
    const lessonInfo = response.timetable.data.lessonInfo;

    if (!lessonInfo) {
      return getValidSchedule(todaysDate, recursionCount + 1);
    }
    return { lessonInfo, scheduleDate: scheduleDate };
  }

  let schedule = await getValidSchedule(todaysDate);
  let scheduleMappedTimes = mapDateToLessonTimes(
    schedule.scheduleDate,
    schedule.lessonInfo,
  );
  let currentOrNextLesson = getCurrentOrNextLesson(
    scheduleMappedTimes,
    todaysDate,
  );

  if (!currentOrNextLesson.lesson) {
    const nextDay = addDaysToDate(todaysDate, 1);
    nextDay.setHours(1, 0, 0, 0);
    console.log("nextDay", nextDay);
    schedule = await getValidSchedule(nextDay);
    scheduleMappedTimes = mapDateToLessonTimes(
      schedule.scheduleDate,
      schedule.lessonInfo,
    );
    console.log("scheduleMappedTimes", scheduleMappedTimes);
    currentOrNextLesson = getCurrentOrNextLesson(
      scheduleMappedTimes,
      todaysDate,
    );
  }

  console.log("targetDate: ", currentOrNextLesson.lesson?.timeStartDate);
  console.log("today: ", todaysDate);

  return (
    <div className="font-mono text-lg">
      <CountdownTimer
        isCurrentLesson={currentOrNextLesson.isCurrentLesson}
        targetDate={
          currentOrNextLesson.isCurrentLesson
            ? currentOrNextLesson.lesson?.timeEndDate!
            : currentOrNextLesson.lesson?.timeStartDate!
        }
      />
      <br />
      <div className=" text-right">
        <div>
          Kurs:{" "}
          <span className="font-bold">
            {currentOrNextLesson.lesson?.texts[0]}
          </span>
        </div>
        <div>
          Lärare:{" "}
          <span className="font-bold">
            {currentOrNextLesson.lesson?.texts[1]}
          </span>
        </div>
        <div>
          Sal:{" "}
          <span className="font-bold">
            {currentOrNextLesson.lesson?.texts[2]}
          </span>
        </div>
      </div>
    </div>
  );
}
