// import { revalidatePath } from "next/cache";
import { Suspense } from "react";

import Title2 from "@/components/general/Title2";
import Section from "@/components/layout/Section";
import TopNav from "@/components/layout/TopNav";
import BouncingText from "@/components/special/BouncingText";

import KlassLista from "./KlassLista";
import AngeSchemaID from "@/app/[kommun]/[skola]/AngeSchemaID";

export default function Page({
  params,
}: {
  params: { kommun: string; skola: string };
}) {
  const komun = decodeURIComponent(params.kommun);
  const skola = decodeURIComponent(params.skola);

  return (
    <>
      <Section>
        <AngeSchemaID skola={skola} />
        <div className=" mt-20 flex w-full flex-col items-center gap-2">
          <Title2>Eller välj schema:</Title2>
          <div
            className=" pb-4 text-center text-sm opacity-70"
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
            <KlassLista komun={komun} skola={skola} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
