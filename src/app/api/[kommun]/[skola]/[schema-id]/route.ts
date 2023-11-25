import { sign } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import getSignature from "@/app/api/utils/getSignature";
import getKey from "@/app/api/utils/getKey";
import getTimetable from "@/app/api/utils/getTimetable";

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
   * * hard coded for haganäskolan älmhult
   * TODO make dynamic
   * */
  if (kommun === "almhult" && skola === "Haganässkolan") {
    const signature = await getSignature(schemaId);
    const key = await getKey();
    const timetable = await getTimetable(
      signature,
      key,
      year,
      week,
      dayOfTheWeek,
    );

    return NextResponse.json(
      { kommun, skola, schemaId, timetable },
      { status: 200 },
    );
  }
  return NextResponse.json({ kommun, skola, schemaId }, { status: 404 });
}
