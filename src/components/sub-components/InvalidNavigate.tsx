"use client";

import { Ripples } from "react-ripples-continued";

import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function InvalidNavigate({ namn }: { namn: string }) {
  return (
    <div
      onClick={() => {
        alert(
          `Vi stödjer tyvär inte användandet av "/" i shcema-Idn eller skol-namn `,
        );
      }}
      className="relative flex w-52 items-center justify-center gap-1 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white py-2 text-center opacity-30 shadow outline-2 outline-offset-2 outline-slate-400 focus:outline [&>svg]:hover:w-5"
    >
      <div>{namn}</div>
      <ArrowRightIcon className="h-5 w-0 transition-all" />
      <Ripples color="black" opacity={0.3} blur={2} on="mouseDown" />
    </div>
  );
}
