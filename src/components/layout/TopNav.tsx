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

  const kommun = pathname.split("/")[1];
  const skola = pathname.split("/")[2];
  const schemaId = pathname.split("/")[3];

  return (
    <div className="sticky top-0 z-50 w-full gap-1 overflow-hidden border-b border-slate-100 bg-gradient-to-t from-slate-100 to-white shadow-md  dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-white [&>svg]:hover:w-5">
      <div className=" relative mx-auto flex max-w-5xl items-end overflow-auto whitespace-nowrap px-6 py-5 text-sm">
        <span className="font-mono text-base underline">
          <Link href="/">när-slutar-lektionen.net</Link>
        </span>
        <div className="flex gap-2 px-4 font-medium">
          {kommun && (
            <div className="flex animate-fade-right items-center gap-2 animate-duration-[400ms] animate-once animate-ease-out">
              <ChevronRightIcon className="heroicon-sw-3 h-4 w-4 opacity-50" />
              <Link
                href={`/${kommun}`}
                className="hover:underline hover:opacity-80"
              >
                {decodeURIComponent(kommun)}
              </Link>
            </div>
          )}
          {skola && (
            <div className="flex animate-fade-right items-center gap-2 animate-duration-[400ms] animate-once animate-ease-out">
              <ChevronRightIcon className="heroicon-sw-3 h-4 w-4 opacity-50" />
              <Link
                href={`/${kommun}/${skola}`}
                className="hover:underline hover:opacity-80"
              >
                {decodeURIComponent(skola)}
              </Link>
            </div>
          )}
          {skola && schemaId && (
            <div className="flex animate-fade-right items-center gap-2 animate-duration-[400ms] animate-once animate-ease-out">
              <ChevronRightIcon className="heroicon-sw-3 h-4 w-4 opacity-50" />
              <Link
                href={`/${kommun}/${skola}/${schemaId}`}
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
