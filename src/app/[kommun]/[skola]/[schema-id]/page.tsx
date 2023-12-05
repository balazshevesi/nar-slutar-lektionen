import { Suspense } from "react";

import Section from "@/components/layout/Section";
import BouncingText from "@/components/special/BouncingText";

import CountDown from "./page-components/CountDown";

export default function Page({
  params,
}: {
  params: { kommun: string; skola: string; "schema-id": string };
}) {
  const komun = decodeURIComponent(params.kommun);
  const skola = decodeURIComponent(params.skola);
  const schemaId = decodeURIComponent(params["schema-id"]);

  return (
    <>
      <Section>
        <Suspense
          fallback={
            <BouncingText tag="h3" className="font-mono">
              Hämtar schema...
            </BouncingText>
          }
        >
          <CountDown komun={komun} skola={skola} schemaId={schemaId} />
        </Suspense>
      </Section>
    </>
  );
}
