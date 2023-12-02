"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Ripples } from "react-ripples-continued";
import { useRouter } from "next/navigation";

export default function AngeSchemaID({ skola }: { skola: string }) {
  const [schemaId, setSchemaId] = useState("");

  const router = useRouter();

  function search(schemaId: string) {
    router.push(`./${skola}/${schemaId}`);
  }

  return (
    <>
      <h2 className="mb-2 text-lg font-medium">Ange ditt schema-id:</h2>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="relative flex w-40 items-center justify-center gap-1 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white py-2 text-center shadow outline-2 outline-offset-2 outline-slate-400 focus:outline"
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
          className="relative flex h-full w-20 items-center justify-center gap-1 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white py-2 text-center shadow outline-2 outline-offset-2 outline-slate-400 focus:outline"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          <Ripples color="black" opacity={0.3} blur={2} on="mouseDown" />
        </button>
      </div>
    </>
  );
}
