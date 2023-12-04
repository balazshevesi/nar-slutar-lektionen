import { Suspense } from "react";

import BouncingText from "@/components/BouncingText";
import GlobalLoadingPage from "@/components/layout/GlobalLoadingPage";
import Section from "@/components/layout/Section";
import TopNav from "@/components/layout/TopNav";

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
      <TopNav />
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
