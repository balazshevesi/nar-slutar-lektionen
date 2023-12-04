import { ReactNode } from "react";

export default function Section({ children }: { children: ReactNode }) {
  return (
    <section className="animate-fade-up animate-once animate-duration-[400ms] animate-ease-out mx-auto max-w-sm p-8 py-12 pb-52">
      <div className="relative z-10 flex w-full flex-col items-center">
        {children}
      </div>
    </section>
  );
}
