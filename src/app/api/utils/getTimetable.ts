export default async function getTimetable(
  signature: string,
  key: string,
  year: number,
  week: number,
  dayOfTheWeek: number,
) {
  try {
    const response = await fetch(
      "https://web.skola24.se/api/render/timetable",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",
        },
        body: JSON.stringify({
          renderKey: String(key),
          selection: String(signature),
          scheduleDay: dayOfTheWeek,
          week: week,
          year: year,

          host: "almhult.skola24.se",
          unitGuid: "OTU1MGZkNTktZGYzMi1mMTRkLWJhZDUtYzI4YWI0MDliZGU3",
          schoolYear: "bb76aa4b-03d4-4c97-83ca-5dc08bd00b1c",
          startDate: null,
          endDate: null,
          blackAndWhite: false,
          width: 125,
          height: 550,
          selectionType: 4,
          showHeader: false,
          periodText: "",
          privateFreeTextMode: false,
          privateSelectionMode: null,
          customerKey: "",
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
