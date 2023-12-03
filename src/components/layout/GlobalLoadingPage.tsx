import Bread from "@/components/layout/Bread";
import Section from "@/components/layout/Section";

import BouncingText from "../BouncingText";

export default function GlobalLoadingPage() {
  return (
    <>
      <Bread />
      <Section>
        <BouncingText tag="h3" className="font-mono">
          Laddar...
        </BouncingText>
      </Section>
    </>
  );
}
