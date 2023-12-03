export default async function fetchKlassLista(unitGuid: string) {
  // revalidatePath("/");
  const response = await fetch(
    "https://web.skola24.se/api/get/timetable/selection",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",
      },
      body: JSON.stringify({
        hostName: "almhult.skola24.se", //! hårdkodat för älmhult
        unitGuid: unitGuid,
        filters: {
          class: true,
          course: false,
          group: false,
          period: false,
          room: false,
          student: false,
          subject: false,
          teacher: false,
        },
      }),
    },
  );
  const data = await response.json();
  return data.data.classes;
}
