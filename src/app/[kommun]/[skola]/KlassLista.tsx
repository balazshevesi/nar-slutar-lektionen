import sleep from "@/utils/debug/sleep";
import getUnitGuidFromSkola from "@/utils/scheduleFetching/getUnitGuidFromSkola";

import NavigateBtn from "@/components/general/NavigateBtn";

import fetchKlassLista from "./fetchKlassLista";

export default async function KlassLista({
  komun,
  skola,
}: {
  komun: string;
  skola: string;
}) {
  console.log("decodeURIComponent(skola)", decodeURIComponent(skola));
  const unitGuid = await getUnitGuidFromSkola(komun, decodeURIComponent(skola));
  const klassLista = await fetchKlassLista(komun, unitGuid);
  return klassLista.map((item: any, i: number) => {
    return (
      <NavigateBtn
        namn={item.groupName}
        routeName={`./${skola}/${item.groupName}`}
        key={item.groupName}
      />
    );
  });
}
