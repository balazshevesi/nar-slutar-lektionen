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
    decodeURI(options.schedule.skola),
  );
  const komun = decodeURI(options.schedule.komun);
  const skola = decodeURI(options.schedule.skola);
  const schemaId = decodeURI(options.schedule.schemaId);
  const year = options.date.year;
  const week = options.date.week;
  const dayOfTheWeek = options.date.dayOfTheWeek;

  /**
   * * hard coded for älmhult
   *   TODO make dynamic
   * */

  let timetable;
  if (komun === "Älmhult") {
    const signature = await getSignature(schemaId);
    const key = await getKey();
    timetable = await getTimetable(
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
  }
  return { komun, skola, schemaId, timetable: timetable || null };
}
