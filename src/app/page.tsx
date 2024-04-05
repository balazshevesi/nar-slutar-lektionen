import Title2 from "@/components/general/Title2";
import ListContainer, { ListItem } from "@/components/layout/ListContainer";
import Section from "@/components/layout/Section";

import NavigateBtn from "../components/general/NavigateBtn";
import kommuner from "@/data/kommuner";

export default function Home() {
  const listItems: ListItem[] = kommuner.map((item: any) => {
    const newItem = item;
    newItem.route = `/${item.namn}`;
    return newItem;
  });

  return (
    <>
      <Section>
        <Title2>Välj din kommun:</Title2>
        <ListContainer autoFocus listItems={listItems} stuff="kommuner" />
      </Section>
    </>
  );
}
