import { revalidatePath } from "next/cache";
export interface FetchSchedule {
  schedule: { komun: string; skola: string; schemaId: string };
  date: { year: number; week: number; dayOfTheWeek: number };
}

export default async function fetchSchedule(options: FetchSchedule) {
  console.log("fetching schedule....");
  revalidatePath("/");
  const response = await fetch(
    `${process.env.DOMAIN}/api/${options.schedule.komun}/${options.schedule.skola}/${options.schedule.schemaId}`,
    {
      method: "post",
      body: JSON.stringify({
        year: options.date.year,
        week: options.date.week,
        dayOfTheWeek: options.date.dayOfTheWeek,
      }),
    },
  );
  const data = await response.json();

  try {
    const schemaIDIsInvalid =
      data.timetable.validation[0].message === "Felaktigt ID";
    if (schemaIDIsInvalid) return "Felaktigt ID";
  } catch {}

  return data;
}
