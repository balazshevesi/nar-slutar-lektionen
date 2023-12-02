import fetchSchedule from "./fetchSchedule";
import { FetchSchedule } from "./fetchSchedule";
import getCurrentWeekNumber from "@/app/utils/getCurrentWeekNumber";
import getNextMondayIfWeekend from "@/app/api/utils/getNextMondayIfWeekend";
import addDaysToDate from "@/app/api/utils/addDaysToDate";
import CountdownTimer from "../../../../components/CountDownTimer";
import FelaktigID from "@/components/FelaktigID";

import { ConsoleLogger } from "aws-amplify/utils";

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

export default async function CountDown({
  komun,
  skola,
  schemaId,
}: CountDownInterface) {
  const now = new Date(); //creates new date object
  const timeOffsetInMS = now.getTimezoneOffset() * 60000;
  const todaysDate = new Date(now.getTime() - timeOffsetInMS); //corrects for the right timezon
  todaysDate.setHours(todaysDate.getHours() + +process.env.ADJUST_TIME!); //correct by .env

  const logger = new ConsoleLogger("CountDown servercomponent logger");
  console.log("server time:", todaysDate);
  logger.info(`server time: ${todaysDate}`);

  //TODO abstract and write test
  async function getValidSchedule(
    todaysDate: Date,
    recursionCount = 0,
  ): Promise<
    | "couldn't find any lessons for the comming 7 days"
    | "Felaktigt ID"
    | {
        lessonInfo: any;
        scheduleDate: Date;
      }
  > {
    //! BUG on AWS amplify?? but works locally??
    if (recursionCount > 7) {
      return "couldn't find any lessons for the comming 7 days";
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
    if (response == "Felaktigt ID") return "Felaktigt ID";
    //* bug is caused by not finding lessonInfo... problem is from response
    const lessonInfo = response.timetable.data.lessonInfo;
    if (!lessonInfo) {
      //* potential source of bug
      return getValidSchedule(todaysDate, recursionCount + 1);
    }
    return { lessonInfo, scheduleDate: scheduleDate };
  }

  let schedule = await getValidSchedule(todaysDate);
  if (schedule === "Felaktigt ID") {
    return <FelaktigID komun={komun} skola={skola} />;
  } else if (schedule === "couldn't find any lessons for the comming 7 days") {
    return <div>Det ser ut som att du har lov!</div>;
  }

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
    schedule = await getValidSchedule(nextDay);
    if (schedule === "Felaktigt ID") {
      return <FelaktigID komun={komun} skola={skola} />;
    } else if (
      schedule === "couldn't find any lessons for the comming 7 days"
    ) {
      return <div>Det ser ut som att du har lov!</div>;
    }
    scheduleMappedTimes = mapDateToLessonTimes(
      schedule.scheduleDate,
      schedule.lessonInfo,
    );
    currentOrNextLesson = getCurrentOrNextLesson(
      scheduleMappedTimes,
      todaysDate,
    );
  }

  return (
    <div className=" w-full max-w-md text-center font-mono text-lg">
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
