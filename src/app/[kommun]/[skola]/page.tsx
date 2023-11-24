"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Ripples } from "react-ripples-continued";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Bread from "@/app/components/Bread";

export default function Page({
  params,
}: {
  params: { kommun: string; skola: string };
}) {
  const kommun = params.kommun;
  const skola = params.skola;

  const [schemaId, setSchemaId] = useState("");
  const router = useRouter();

  function search(schemaId: string) {
    router.push(`./${skola}/${schemaId}`);
  }

  return (
    <div className="flex h-[100dvh] flex-col items-center p-8">
      <Bread kommun={kommun} skola={skola} />
      <h2 className="mb-2 text-lg font-medium">Ange ditt schema-id:</h2>
      <div className=" flex items-center gap-2">
        <input
          type="text"
          className="relative flex w-40 items-center justify-center gap-1 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white py-2 text-center shadow outline-2 outline-offset-2  outline-sky-400 focus:outline"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSchemaId(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search(schemaId);
            }
          }}
        />
        <button
          onClick={() => {
            search(schemaId);
          }}
          className="relative flex h-full w-20 items-center justify-center gap-1 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white py-2 text-center shadow outline-2 outline-offset-2  outline-sky-400 focus:outline"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          <Ripples color="black" opacity={0.3} blur={2} on="mouseDown" />
        </button>
      </div>
    </div>
  );
}
