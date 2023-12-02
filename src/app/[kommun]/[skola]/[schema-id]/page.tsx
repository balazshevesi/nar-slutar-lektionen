import { Suspense } from "react";

import Bread from "@/components/layout/Bread";
import Section from "@/components/layout/Section";

import CountDown from "./page-components/CountDown";

export default function Page({
  params,
}: {
  params: { kommun: string; skola: string; "schema-id": string };
}) {
  const komun = params.kommun;
  const skola = params.skola;
  const schemaId = params["schema-id"];

  return (
    <Section>
      <Bread />
      <Suspense fallback={<h3 className="font-mono">hämtar schema...</h3>}>
        <CountDown komun={komun} skola={skola} schemaId={schemaId} />
      </Suspense>
      <div className="relative mt-auto select-none pb-16 text-center font-mono opacity-20">
        <span>hemsida skapad av</span>
        <br />
        <span className="font-bold">Balazs Hevesi</span>
      </div>
    </Section>
  );
}
