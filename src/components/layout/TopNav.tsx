import { headers } from "next/headers";
import Link from "next/link";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

import DarkModeToggle from "../DarkModeToggle";

export default function TopNav() {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const kommun = pathname.split("/")[1];
  const skola = pathname.split("/")[2];
  const schemaId = pathname.split("/")[3];

  if (!kommun && !skola && !schemaId)
    return (
      <div className="p-2 pt-8 text-center italic text-slate-500">
        <DarkModeToggle />
        Välkommen till{" "}
        <span className="font-mono underline">när-slutar-lektionen.net</span>
      </div>
    );

  return (
    <div className="w-full overflow-auto text-center font-mono text-sm font-semibold italic text-slate-500">
      <DarkModeToggle />
      <div className="mx-auto flex w-fit items-center gap-1 p-2 pt-8">
        <Link href={"/"} className="hover:underline hover:opacity-80">
          när-slutar-lektionen.net
        </Link>
        {kommun && (
          <>
            <ChevronRightIcon className="heroicon-sw-3 h-4 w-4" />
            <Link
              href={`/${kommun}`}
              className="hover:underline hover:opacity-80"
            >
              {decodeURIComponent(kommun)}
            </Link>
          </>
        )}
        {skola && (
          <>
            <ChevronRightIcon className="heroicon-sw-3 h-4 w-4" />
            <Link
              href={`/${kommun}/${skola}`}
              className="hover:underline hover:opacity-80"
            >
              {decodeURIComponent(skola)}
            </Link>
          </>
        )}
        {skola && schemaId && (
          <>
            <ChevronRightIcon className="heroicon-sw-3 h-4 w-4" />
            <Link
              href={`/${kommun}/${skola}/${schemaId}`}
              className="hover:underline hover:opacity-80"
            >
              {decodeURIComponent(schemaId)}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
