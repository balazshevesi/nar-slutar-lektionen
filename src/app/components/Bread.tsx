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
    <div className="flex items-center p-2 text-center text-sm font-semibold italic text-slate-500">
      <Link href={"/"} className="hover:underline">
        hem
      </Link>
      {kommun && (
        <>
          <ChevronRightIcon className="heroicon-sw-2 h-5 w-5" />
          <Link href={`/${kommun}`} className="hover:underline">
            {kommun}
          </Link>
        </>
      )}
      {skola && (
        <>
          <ChevronRightIcon className="heroicon-sw-2 h-5 w-5" />
          <Link href={`/${kommun}/${skola}`} className="hover:underline">
            {skola}
          </Link>
        </>
      )}
      {schemaId && (
        <>
          <ChevronRightIcon className="heroicon-sw-2 h-5 w-5" />
          <Link
            href={`/${kommun}/${skola}/${schemaId}`}
            className="hover:underline"
          >
            {schemaId}
          </Link>
        </>
      )}
    </div>
  );
}
