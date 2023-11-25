export interface FetchSchedule {
  schedule: { komun: string; skola: string; schemaId: string };
  date: { year: number; week: number; dayOfTheWeek: number };
}

export default async function fetchSchedule(options: FetchSchedule) {
  const response = await fetch(
    `http://localhost:3001/api/${options.schedule.komun}/${options.schedule.skola}/${options.schedule.schemaId}`,
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
  return data;
}
