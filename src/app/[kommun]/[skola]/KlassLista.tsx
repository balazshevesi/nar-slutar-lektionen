import sleep from "@/utils/debug/sleep";
import getUnitGuidFromSkola from "@/utils/scheduleFetching/getUnitGuidFromSkola";

import NavigateBtn from "@/components/general/NavigateBtn";

import fetchKlassLista from "./fetchKlassLista";

export default async function KlassLista({ skola }: { skola: string }) {
  const unitGuid = await getUnitGuidFromSkola(decodeURIComponent(skola));
  const klassLista = await fetchKlassLista(unitGuid);
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
