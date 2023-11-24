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

  console.log("helo", kommun, skola, schemaId);

  /**
   * * hard coded for haganäskolan älmhult
   * TODO make dynamic
   * */
  if (kommun === "almhult" && skola === "haganasskolan") {
    //

    console.log("schemaId", schemaId);
    const signature = await getSignature(schemaId);
    console.log("signature", signature);
    const key = await getKey();
    console.log("key", key);
    const timetable = await getTimetable(signature, key, 2023, 47, 5);

    //

    return NextResponse.json(
      { kommun, skola, schemaId, timetable },
      { status: 200 },
    );
  }
  return NextResponse.json({ kommun, skola, schemaId }, { status: 404 });
}
