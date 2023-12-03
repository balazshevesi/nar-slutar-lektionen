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
    <>
      <Bread />
      <Section>
        <Suspense fallback={<h3 className="font-mono">hämtar schema...</h3>}>
          <CountDown komun={komun} skola={skola} schemaId={schemaId} />
        </Suspense>
      </Section>
    </>
  );
}
