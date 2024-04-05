import { revalidatePath } from "next/cache";

import { kommunToSkola24 } from "@/utils/sanitize/kommunToSkola24";
import getKey from "@/utils/scheduleFetching/getKey";
import getSchoolYear from "@/utils/scheduleFetching/getSchoolYear";
import getSignature from "@/utils/scheduleFetching/getSignature";
import getTimetable from "@/utils/scheduleFetching/getTimetable";
import getUnitGuidFromSkola from "@/utils/scheduleFetching/getUnitGuidFromSkola";

export interface FetchSchedule {
  schedule: { kommun: string; skola: string; schemaId: string };
  date: { year: number; week: number; dayOfTheWeek: number };
}
export default async function fetchSchedule(options: FetchSchedule) {
  revalidatePath("/");
  const unitGuid = await getUnitGuidFromSkola(
    decodeURIComponent(options.schedule.kommun),
    decodeURIComponent(options.schedule.skola),
  );
  const kommun = decodeURIComponent(options.schedule.kommun);
  const skola = decodeURIComponent(options.schedule.skola);
  const schemaId = decodeURIComponent(options.schedule.schemaId);
  const year = options.date.year;
  const week = options.date.week;
  const dayOfTheWeek = options.date.dayOfTheWeek;

  const schoolYear = await getSchoolYear(
    `${kommunToSkola24(kommun)}.skola24.se`,
  );
  const signature = await getSignature(schemaId);
  const key = await getKey();
  const timetable = await getTimetable(
    schoolYear,
    kommun,
    signature,
    key,
    year,
    week,
    dayOfTheWeek,
    unitGuid,
  );
  try {
    const schemaIDIsInvalid =
      timetable.validation[0].message === "Felaktigt ID";
    if (schemaIDIsInvalid) return "Felaktigt ID";
  } catch {}

  return { kommun, skola, schemaId, timetable: timetable || null };
}
