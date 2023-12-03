import Section from "@/components/layout/Section";

import NavigateBtn from "../components/NavigateBtn";
import Bread from "../components/layout/Bread";

export default function Home() {
  return (
    <>
      <Bread />
      <Section>
        <h2 className="mb-2 text-lg font-medium">Välj din kommun:</h2>
        <div className="flex flex-col gap-2">
          <NavigateBtn namn="Älmhult" routeName="/Älmhult" />
        </div>
      </Section>
    </>
  );
}
