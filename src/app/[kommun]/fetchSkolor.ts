export default async function fetchSkolor(hostName: string) {
  const response = await fetch(
    "https://web.skola24.se/api/services/skola24/get/timetable/viewer/units",
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",
      },
      body: JSON.stringify({
        getTimetableViewerUnitsRequest: { hostName: hostName },
      }),
    },
  );
  const data = await response.json();
  console.log("data", JSON.stringify(data));
  const listOfUnits = data.data.getTimetableViewerUnitsResponse.units;

  return listOfUnits;
}
