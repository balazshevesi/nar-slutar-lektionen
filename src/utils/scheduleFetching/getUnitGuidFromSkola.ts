import { kommunToSkola24 } from "@/utils/sanitize/kommunToSkola24";

export default async function getUnitGuidFromSkola(
  kommun: string,
  skola: string,
) {
  try {
    const listOfUnitsResponse = await fetch(
      "https://web.skola24.se/api/services/skola24/get/timetable/viewer/units",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",
        },
        body: JSON.stringify({
          getTimetableViewerUnitsRequest: {
            hostName: `${kommunToSkola24(kommun)}.skola24.se`,
          },
        }),
      },
    );

    if (!listOfUnitsResponse.ok) {
      throw new Error(`HTTP error! status: ${listOfUnitsResponse.status}`);
    }

    const listOfUnitsData = await listOfUnitsResponse.json();

    if (!listOfUnitsData?.data?.getTimetableViewerUnitsResponse?.units) {
      throw new Error("Invalid response structure from Skola24 API");
    }

    const list = listOfUnitsData.data.getTimetableViewerUnitsResponse.units;
    const theUnit = list.filter((item: any) => {
      return item.unitId === skola;
    });

    if (!theUnit || theUnit.length === 0) {
      throw new Error(`No unit found for school: ${skola}`);
    }

    const theUnitGuid = theUnit[0].unitGuid;
    if (!theUnitGuid) {
      throw new Error(`No unitGuid found for school: ${skola}`);
    }

    return theUnitGuid;
  } catch (error) {
    console.error("Error in getUnitGuidFromSkola:", error);
    throw error; // Re-throw to handle it in the calling code
  }
}
