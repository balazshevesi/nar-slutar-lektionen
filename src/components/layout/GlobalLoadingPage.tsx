import Section from "@/components/layout/Section";
import TopNav from "@/components/layout/TopNav";

import BouncingText from "../special/BouncingText";

export default function GlobalLoadingPage() {
  return (
    <>
      <Section>
        <BouncingText tag="h3" className="font-mono">
          Laddar...
        </BouncingText>
      </Section>
    </>
  );
}
