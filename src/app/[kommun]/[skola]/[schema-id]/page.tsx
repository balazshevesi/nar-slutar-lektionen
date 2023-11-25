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
      <h2 className="mb-2 text-lg font-medium">{schemaId}</h2>
      <Suspense fallback={<h3>laddar...</h3>}>
        <CountDown komun={komun} skola={skola} schemaId={schemaId} />
      </Suspense>
    </div>
  );
}
