"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function AngeSchemaID({ skola }: { skola: string }) {
  const [schemaId, setSchemaId] = useState("");

  const router = useRouter();

  function search(schemaId: string) {
    router.push(`./${skola}/${schemaId}`);
  }

  return (
    <>
      <h2 className="mb-2 text-lg font-medium">Ange ditt schema-id:</h2>
      <div className="bg- flex items-center gap-2">
        <input
          type="text"
          className="relative flex w-52 items-center justify-center gap-1 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white py-2 text-center shadow outline-2 outline-offset-2 outline-slate-400 focus:outline dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-white dark:outline-slate-500 [&>svg]:hover:w-5"
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
          className="relative flex h-full w-20 items-center justify-center gap-1 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white py-2 text-center shadow outline-2 outline-offset-2 outline-slate-400 focus:outline dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-white dark:outline-slate-500 [&>svg]:hover:w-5"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
