import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Bread({
  kommun,
  skola,
  schemaId,
}: {
  kommun?: string;
  skola?: string;
  schemaId?: string;
  params?: string;
}) {
  if (!kommun && !skola && !schemaId)
    return (
      <div className="p-2 text-center italic text-slate-500">
        Välkommen till{" "}
        <span className="font-mono underline">när-slutar-lektionen.se</span>
      </div>
    );

  return (
    <div className="flex items-center gap-1 p-2 text-center font-mono text-sm font-semibold italic text-slate-500">
      <Link href={"/"} className="hover:underline hover:opacity-80">
        hem
      </Link>
      {kommun && (
        <>
          <ChevronRightIcon className="heroicon-sw-3 h-4 w-4" />
          <Link
            href={`/${kommun}`}
            className="hover:underline hover:opacity-80"
          >
            {kommun}
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
            {skola}
          </Link>
        </>
      )}
      {schemaId && (
        <>
          <ChevronRightIcon className="heroicon-sw-3 h-4 w-4" />
          <Link
            href={`/${kommun}/${skola}/${schemaId}`}
            className="hover:underline hover:opacity-80"
          >
            {schemaId}
          </Link>
        </>
      )}
    </div>
  );
}