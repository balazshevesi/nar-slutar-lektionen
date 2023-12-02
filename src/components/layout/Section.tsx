import { ReactNode } from "react";

export default function Section({ children }: { children: ReactNode }) {
  return (
    <section className="p-8 pb-52">
      <div className="relative z-10 flex flex-col items-center bg-white">
        {children}
      </div>
      <div className="fixed bottom-12 left-0 right-0 z-0 mx-auto select-none pb-16 text-center font-mono opacity-20">
        <span>hemsida skapad av</span>
        <br />
        <span className="font-bold">Balazs Hevesi</span>
      </div>
    </section>
  );
}
