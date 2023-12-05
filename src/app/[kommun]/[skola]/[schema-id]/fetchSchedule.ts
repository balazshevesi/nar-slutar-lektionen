import { revalidatePath } from "next/cache";

import getKey from "@/utils/scheduleFetching/getKey";
import getSignature from "@/utils/scheduleFetching/getSignature";
import getTimetable from "@/utils/scheduleFetching/getTimetable";
import getUnitGuidFromSkola from "@/utils/scheduleFetching/getUnitGuidFromSkola";

export interface FetchSchedule {
  schedule: { komun: string; skola: string; schemaId: string };
  date: { year: number; week: number; dayOfTheWeek: number };
}
export default async function fetchSchedule(options: FetchSchedule) {
  revalidatePath("/");
  const unitGuid = await getUnitGuidFromSkola(
    decodeURIComponent(options.schedule.komun),
    decodeURIComponent(options.schedule.skola),
  );
  const komun = decodeURIComponent(options.schedule.komun);
  const skola = decodeURIComponent(options.schedule.skola);
  const schemaId = decodeURIComponent(options.schedule.schemaId);
  const year = options.date.year;
  const week = options.date.week;
  const dayOfTheWeek = options.date.dayOfTheWeek;

  const signature = await getSignature(schemaId);
  const key = await getKey();
  const timetable = await getTimetable(
    komun,
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
  console.log("timetable", timetable);

  return { komun, skola, schemaId, timetable: timetable || null };
}
