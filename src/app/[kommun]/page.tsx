import { kommunToSkola24 } from "@/utils/sanitize/kommunToSkola24";

import Title2 from "@/components/general/Title2";
import ListContainer, { ListItem } from "@/components/layout/ListContainer";
import Section from "@/components/layout/Section";

import NavigateBtn from "../../components/general/NavigateBtn";
import fetchSkolor from "./fetchSkolor";

export default async function Page({ params }: { params: { kommun: string } }) {
  const kommun = decodeURIComponent(params.kommun);

  const listOfUnits = await fetchSkolor(
    `${kommunToSkola24(kommun)}.skola24.se`,
  );

  const listItems: ListItem[] = listOfUnits.map((item: any) => {
    const newItem = item;
    newItem.route = `/${kommun}/${item.unitId}`;
    newItem.namn = item.unitId;
    return newItem;
  });

  return (
    <>
      <Section>
        <Title2>Välj din skola:</Title2>
        <ListContainer autoFocus listItems={listItems} stuff="skolor" />
      </Section>
    </>
  );
}
