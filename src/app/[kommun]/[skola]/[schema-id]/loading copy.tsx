import Bread from "@/components/layout/Bread";
import Section from "@/components/layout/Section";

export default function Loading() {
  return (
    <>
      <Bread />
      <Section>
        <h3 className="font-mono">Laddar...</h3>
      </Section>
    </>
  );
}
