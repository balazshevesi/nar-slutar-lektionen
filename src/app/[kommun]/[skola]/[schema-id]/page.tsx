import Bread from "@/app/components/Bread";
import CountDown from "./CountDown";
import { Suspense } from "react";

export default function Page({
  params,
}: {
  params: { kommun: string; skola: string; "schema-id": string };
}) {
  const komun = params.kommun;
  const skola = params.skola;
  const schemaId = params["schema-id"];

  return (
    <div className="flex h-[100dvh] flex-col items-center p-8">
      <Bread kommun={komun} skola={skola} schemaId={schemaId} />
      <h2 className="mb-2 flex items-center gap-1 text-lg font-medium">
        {/* {schemaId} <Favourite schemaId={schemaId} listOfFavsProp={listOfFavs} /> */}
      </h2>
      <Suspense fallback={<h3 className=" font-mono">hämtar schema...</h3>}>
        <CountDown komun={komun} skola={skola} schemaId={schemaId} />
      </Suspense>
      <div className="relative mt-auto select-none pb-16 text-center font-mono opacity-20">
        <span>hemsida skapad av</span>
        <br />
        <span className="font-bold">Balazs Hevesi</span>
      </div>
    </div>
  );
}