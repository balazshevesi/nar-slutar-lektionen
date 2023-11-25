import NavigateBtn from "../components/NavigateBtn";
import Bread from "../components/Bread";
import { json } from "stream/consumers";

export default async function Page({ params }: { params: { kommun: string } }) {
  const kommun = params.kommun;

  const response = await fetch(
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
  const data = await response.json();
  const listOfUnits = data.data.getTimetableViewerUnitsResponse.units;
  console.log("listOfUnits", listOfUnits);

  return (
    <div className="flex h-[100dvh] flex-col items-center p-8">
      <Bread kommun={kommun} />
      <h2 className="mb-2 text-lg font-medium">Välj din skola:</h2>
      <div className=" flex flex-col gap-2">
        {listOfUnits.map((unit: any) => {
          return (
            <NavigateBtn
              key={0}
              namn={unit.unitId}
              routeName={`${kommun}/${unit.unitId}`}
            />
          );
        })}
      </div>
    </div>
  );
}
