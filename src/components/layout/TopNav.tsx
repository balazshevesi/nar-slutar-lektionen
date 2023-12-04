"use client";

import { headers } from "next/headers";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

import DarkModeToggle from "../general/DarkModeToggle";

function NavItem({ item }: { item: string }) {
  return (
    item && (
      <>
        <ChevronRightIcon className="heroicon-sw-3 h-4 w-4" />
        <Link href={`/${item}`} className="hover:underline hover:opacity-80">
          {decodeURIComponent(item)}
        </Link>
      </>
    )
  );
}

export default function TopNav() {
  // const headersList = headers();
  // const pathname = headersList.get("x-pathname") || "";
  const pathname = usePathname();

  const komun = pathname.split("/")[1];
  const skola = pathname.split("/")[2];
  const schemaId = pathname.split("/")[3];

  return (
    // <div className="p-2 pt-8 text-center italic text-slate-500">
    //   <DarkModeToggle />
    //   Välkommen till{" "}
    //   <span className="font-mono underline">när-slutar-lektionen.net</span>
    // </div>
    <div className="sticky top-0 z-50 w-full gap-1 overflow-hidden border-b border-slate-100 bg-gradient-to-t from-slate-100 to-white py-4 shadow-md  dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-white [&>svg]:hover:w-5">
      <div className=" relative mx-auto flex max-w-5xl items-end overflow-auto whitespace-nowrap px-6 text-sm">
        <span className="font-mono text-base underline">
          <Link href="/">när-slutar-lektionen.net</Link>
        </span>
        <div className="flex gap-2 px-4 font-medium">
          {komun && (
            <div className="animate-fade-right animate-once animate-duration-[400ms] animate-ease-out flex items-center gap-2">
              <ChevronRightIcon className="heroicon-sw-3 h-4 w-4 opacity-50" />
              <Link
                href={`/${komun}`}
                className="hover:underline hover:opacity-80"
              >
                {decodeURIComponent(komun)}
              </Link>
            </div>
          )}
          {skola && (
            <div className="animate-fade-right animate-once animate-duration-[400ms] animate-ease-out flex items-center gap-2">
              <ChevronRightIcon className="heroicon-sw-3 h-4 w-4 opacity-50" />
              <Link
                href={`/${komun}/${skola}`}
                className="hover:underline hover:opacity-80"
              >
                {decodeURIComponent(skola)}
              </Link>
            </div>
          )}
          {skola && schemaId && (
            <div className="animate-fade-right animate-once animate-duration-[400ms] animate-ease-out flex items-center gap-2">
              <ChevronRightIcon className="heroicon-sw-3 h-4 w-4 opacity-50" />
              <Link
                href={`/${komun}/${skola}/${schemaId}`}
                className="hover:underline hover:opacity-80"
              >
                {decodeURIComponent(schemaId)}
              </Link>
            </div>
          )}
        </div>
        <div className="sticky right-0 top-0 ml-auto flex items-center justify-center rounded-full px-2 backdrop-blur">
          <DarkModeToggle />
        </div>
      </div>
    </div>
  );
}
