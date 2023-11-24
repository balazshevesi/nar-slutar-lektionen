"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Ripples } from "react-ripples-continued";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Bread from "@/app/components/Bread";

export default function Page({
  params,
}: {
  params: { kommun: string; skola: string; "schema-id": string };
}) {
  const kommun = params.kommun;
  const skola = params.skola;
  const schemaId = params["schema-id"];

  const router = useRouter();

  function search(schemaId: string) {
    router.push(`./${skola}/${schemaId}`);
  }

  return (
    <div className="flex h-[100dvh] flex-col items-center p-8">
      <Bread kommun={kommun} skola={skola} schemaId={schemaId} />
      <h2 className="mb-2 text-lg font-medium">{schemaId}</h2>
    </div>
  );
}
