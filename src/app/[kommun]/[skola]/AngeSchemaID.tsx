"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import Title2 from "@/components/general/Title2";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function AngeSchemaID({ skola }: { skola: string }) {
  const [schemaId, setSchemaId] = useState("");

  const router = useRouter();

  function search(schemaId: string) {
    router.push(`./${skola}/${schemaId}`);
  }

  return (
    <>
      <Title2>Ange ditt schema-id:</Title2>
      <div className="flex w-full items-center gap-2">
        <input
          autoFocus
          placeholder="Ange ditt schema-id"
          type="text"
          className="h-10 grow rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white px-4 text-center shadow outline-2 outline-offset-2 outline-primary focus:outline dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-white"
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
          className="flex h-10 w-20 items-center justify-center rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white shadow outline-2 outline-offset-2 outline-primary focus:outline dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-white"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
