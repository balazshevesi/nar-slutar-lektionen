import { sign } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import getSignature from "@/app/api/utils/getSignature";
import getKey from "@/app/api/utils/getKey";
import getTimetable from "@/app/api/utils/getTimetable";

async function getUnitGuidFromSkola(skola: string) {
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

  console.log("skolaaa", skola);
  console.log("dataaaa", listOfUnitsData);
  const list = listOfUnitsData.data.getTimetableViewerUnitsResponse.units;
  const theUnit = list.filter((item: any) => {
    console.log("item", item);
    return item.unitId === skola;
  });
  console.log("getUnitGuidFromSkola", theUnit);
  const theUnitGuid = theUnit[0].unitGuid;
  return theUnitGuid;
}

export async function POST(
  request: Request,
  {
    params,
  }: { params: { kommun: string; skola: string; "schema-id": string } },
) {
  // dynamic route
  const kommun = params.kommun;
  const skola = params.skola;
  const schemaId = params["schema-id"];

  // body
  const reqbody = await request.json();
  const year = reqbody.year;
  const week = reqbody.week;
  const dayOfTheWeek = reqbody.dayOfTheWeek;

  /**
   * * hard coded for älmhult
   * TODO make dynamic
   * */

  const unitGuid = await getUnitGuidFromSkola(skola);
  console.log("unitGuid", unitGuid);

  if (kommun === "Älmhult") {
    const signature = await getSignature(schemaId);
    const key = await getKey();
    const timetable = await getTimetable(
      signature,
      key,
      year,
      week,
      dayOfTheWeek,
      unitGuid,
    );

    return NextResponse.json(
      { kommun, skola, schemaId, timetable },
      { status: 200 },
    );
  }
  return NextResponse.json({ kommun, skola, schemaId }, { status: 404 });
}
