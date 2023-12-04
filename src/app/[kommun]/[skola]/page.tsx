// import { revalidatePath } from "next/cache";
import { Suspense } from "react";

import BouncingText from "@/components/BouncingText";
import Section from "@/components/layout/Section";
import TopNav from "@/components/layout/TopNav";

import KlassLista from "./KlassLista";
import AngeSchemaID from "@/app/[kommun]/[skola]/AngeSchemaID";

export default function Page({
  params,
}: {
  params: { kommun: string; skola: string };
}) {
  const kommun = params.kommun;
  const skola = params.skola;

  return (
    <>
      <TopNav />
      <Section>
        <AngeSchemaID skola={skola} />
        <div className=" mt-8 flex flex-col items-center gap-2">
          <div
            className=" text-center text-sm opacity-70"
            //@ts-ignore
            style={{ textWrap: "balance" }}
          >
            (OBS, använd helst ditt personliga schema ID, hemsidan kan visa fel
            om det finnns överlappande lektioner)
          </div>
          <Suspense
            fallback={
              <BouncingText tag="div" className="font-mono">
                Laddar...
              </BouncingText>
            }
          >
            <KlassLista skola={skola} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
