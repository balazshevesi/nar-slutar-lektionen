import sleep from "@/utils/debug/sleep";
import getUnitGuidFromSkola from "@/utils/scheduleFetching/getUnitGuidFromSkola";

import NavigateBtn from "@/components/general/NavigateBtn";
import ListContainer, { ListItem } from "@/components/layout/ListContainer";

import fetchKlassLista from "./fetchKlassLista";

export default async function KlassLista({
  kommun,
  skola,
}: {
  kommun: string;
  skola: string;
}) {
  const unitGuid = await getUnitGuidFromSkola(
    kommun,
    decodeURIComponent(skola),
  );
  const klassLista = await fetchKlassLista(kommun, unitGuid);

  const listItems: ListItem[] = klassLista.map((item: any) => {
    const newItem = item;
    newItem.route = `/${kommun}/${skola}/${item.groupName}`;
    newItem.namn = item.groupName;
    return newItem;
  });

  return <ListContainer listItems={listItems} stuff="klasser" />;
}
