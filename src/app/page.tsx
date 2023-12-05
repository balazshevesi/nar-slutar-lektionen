import Title2 from "@/components/general/Title2";
import Section from "@/components/layout/Section";

import NavigateBtn from "../components/general/NavigateBtn";
import kommuner from "@/data/komuner";

export default function Home() {
  return (
    <>
      <Section>
        <Title2>Välj din kommun:</Title2>
        <div className="flex w-full flex-col gap-2">
          <NavigateBtn namn="Älmhult" routeName="/Älmhult" />
          {kommuner.map((item) => {
            return (
              <NavigateBtn
                routeName={"/" + item.namn}
                namn={item.namn}
                key={item.namn}
              />
            );
          })}
        </div>
      </Section>
    </>
  );
}
