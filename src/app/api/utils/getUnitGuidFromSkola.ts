export default async function getUnitGuidFromSkola(skola: string) {
  const listOfUnitsResponse = await fetch(
    "https://web.skola24.se/api/services/skola24/get/timetable/viewer/units",
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",
      },
      body: JSON.stringify({
        getTimetableViewerUnitsRequest: { hostName: "almhult.skola24.se" },
      }),
    },
  );
  const listOfUnitsData = await listOfUnitsResponse.json();

  const list = listOfUnitsData.data.getTimetableViewerUnitsResponse.units;
  const theUnit = list.filter((item: any) => {
    return item.unitId === skola;
  });
  console.log("skolaaaa", skola);
  console.log("listtt", list);
  console.log("getUnitGuidFromSkola", theUnit);
  const theUnitGuid = theUnit[0].unitGuid;
  return theUnitGuid;
}
