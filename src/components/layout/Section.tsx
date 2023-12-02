import { ReactNode } from "react";

export default function Section({ children }: { children: ReactNode }) {
  return (
    <section className="flex flex-col items-center p-8 pb-24">
      {children}
    </section>
  );
}
