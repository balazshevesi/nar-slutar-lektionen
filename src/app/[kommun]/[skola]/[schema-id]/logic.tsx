import fetchSchedule from "./fetchSchedule";
import { FetchSchedule } from "./fetchSchedule";

interface ScheduleEntry {
  blockName: string;
  dayOfWeekNumber: number;
  guidId: string;
  texts: string[];
  timeEnd: string;
  timeStart: string;
  timeStartDate?: any;
}

function findNextLessonAndTimeUntilStart(
  lessonInfo: ScheduleEntry[],
  lookForFirst: boolean = false,
): { nextLesson: ScheduleEntry | null; timeUntilStart: number | null } {
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeString = lookForFirst
    ? "00:00:00"
    : `${currentHours}:${currentMinutes < 10 ? "0" : ""}${currentMinutes}:00`;

  // Filter lessons that start after the current/00:00 time
  const upcomingLessons = lessonInfo.filter(
    (lesson) => lesson.timeStart > currentTimeString,
  );

  // Sort them by start time
  upcomingLessons.sort((a, b) => a.timeStart.localeCompare(b.timeStart));

  // Get the next lesson
  const nextLesson = upcomingLessons.length > 0 ? upcomingLessons[0] : null;

  let timeUntilStart = null;
  if (nextLesson) {
    const nextLessonStartTime = new Date(
      currentTime.toDateString() + " " + nextLesson.timeStart,
    );
    timeUntilStart =
      (nextLessonStartTime.getTime() - currentTime.getTime()) / 60000; // Time difference in minutes
  }

  return { nextLesson, timeUntilStart };
}

function getCurrentLessons(lessonInfo: ScheduleEntry[]): ScheduleEntry[] {
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeString = `${currentHours}:${
    currentMinutes < 10 ? "0" : ""
  }${currentMinutes}:00`;

  return lessonInfo.filter((lesson) => {
    const startTime = lesson.timeStart;
    const endTime = lesson.timeEnd;
    return startTime <= currentTimeString && endTime > currentTimeString;
  });
}

function filterScheduleForDay(
  lessonInfo: ScheduleEntry[],
  dayOfTheWeek: number,
) {
  return lessonInfo.filter((entry) => entry.dayOfWeekNumber === dayOfTheWeek);
}

function areThereLessonsThisDay(
  lessonInfo: ScheduleEntry[],
  dayOfTheWeek: number,
) {
  //inga lektioner
  if (lessonInfo.length === 0) return false;
  if (!lessonInfo) return false;
  //om det är helg
  if (dayOfTheWeek === 6 || dayOfTheWeek === 7) return false;
  //default
  return true;
}

export default function logic(
  lessonInfo: ScheduleEntry[],
  options: FetchSchedule,
  recursiveMode = false,
  recursiveCount = 0,
  setSchedule: Function,
) {
  const dayOfTheWeek = options.date.dayOfTheWeek; //if recusive mode is true, then we give it 1, meaning it will act as if its monday
  if (recursiveCount > 7) return; // limit recusion //! edge case: holidays
  if (!lessonInfo || !areThereLessonsThisDay(lessonInfo, dayOfTheWeek)) {
    console.log("didn't find schedules, requesting the next days schedule...");
    const newOptions = {
      ...options,
      date: { ...options.date, dayOfTheWeek: dayOfTheWeek + 1 }, //! edge case: new weeks
    };
    fetchSchedule(newOptions).then((data) => {
      logic(
        data.timetable.data.lessonInfo,
        options,
        true,
        recursiveCount++,
        setSchedule,
      );
    });
    return;
  }

  const lookingForToday = dayOfTheWeek === new Date().getDay(); //if todays day, and the day we're looking for differ

  const currentLessons = lookingForToday ? getCurrentLessons(lessonInfo) : [];

  if (currentLessons.length === 0) {
    const nextLesson = findNextLessonAndTimeUntilStart(
      { ...lessonInfo },
      !lookingForToday,
    );
    const returnValue = { ...nextLesson, isActiveLesson: false };
    console.log(returnValue);
    setSchedule(returnValue);
    return returnValue;
  }
}
