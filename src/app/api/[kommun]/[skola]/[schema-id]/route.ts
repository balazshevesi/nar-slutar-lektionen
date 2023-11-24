import { sign } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import getSignature from "@/app/api/utils/getSignature";
import getKey from "@/app/api/utils/getKey";
import getTimetable from "@/app/api/utils/getTimetable";

export async function GET(
  request: Request,
  {
    params,
  }: { params: { kommun: string; skola: string; "schema-id": string } },
) {
  const kommun = params.kommun;
  const skola = params.skola;
  const schemaId = params["schema-id"];

  /**
   * * hard coded for haganäskolan älmhult
   * TODO make dynamic
   * */
  if (kommun === "almhult" && skola === "haganasskolan") {
    //

    const signature = await getSignature(schemaId);
    const key = await getKey();
    const timetable = await getTimetable(signature, key, 2023, 47, 5);

    console.log("signature", signature);
    console.log("key", key);
    console.log("timetable", timetable);

    //

    return NextResponse.json(
      { kommun, skola, schemaId, timetable },
      { status: 200 },
    );
  }
  return NextResponse.json({ kommun, skola, schemaId }, { status: 404 });
}
