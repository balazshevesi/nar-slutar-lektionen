import Section from "@/components/layout/Section";
import TopNav from "@/components/layout/TopNav";

import BouncingText from "../BouncingText";

export default function GlobalLoadingPage() {
  return (
    <>
      <TopNav />
      <Section>
        <BouncingText tag="h3" className="font-mono">
          Laddar...
        </BouncingText>
      </Section>
    </>
  );
}
