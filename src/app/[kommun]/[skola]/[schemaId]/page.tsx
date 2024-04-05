import { Suspense } from "react";

import Section from "@/components/layout/Section";
import BouncingText from "@/components/special/BouncingText";

import CountDown from "./page-components/CountDown";

export default function Page({
  params,
}: {
  params: { kommun: string; skola: string; schemaId: string };
}) {
  const kommun = decodeURIComponent(params.kommun);
  const skola = decodeURIComponent(params.skola);
  const schemaId = decodeURIComponent(params["schemaId"]);

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
          <CountDown kommun={kommun} skola={skola} schemaId={schemaId} />
        </Suspense>
      </Section>
    </>
  );
}
