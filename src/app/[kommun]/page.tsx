import { komunToSkola24 } from "@/utils/sanitize/komunToSkola24";

import Title2 from "@/components/general/Title2";
import Section from "@/components/layout/Section";

import NavigateBtn from "../../components/general/NavigateBtn";
import fetchSkolor from "./fetchSkolor";

export default async function Page({ params }: { params: { kommun: string } }) {
  const komun = decodeURIComponent(params.kommun);

  const listOfUnits = await fetchSkolor(`${komunToSkola24(komun)}.skola24.se`);

  return (
    <>
      <Section>
        <Title2>Välj din skola:</Title2>
        <div className="flex w-full flex-col gap-2">
          {listOfUnits.map((unit: any) => {
            return (
              <NavigateBtn
                key={0}
                namn={unit.unitId}
                routeName={`${komun}/${unit.unitId}`}
              />
            );
          })}
        </div>
      </Section>
    </>
  );
}
