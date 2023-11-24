import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { Ripples } from "react-ripples-continued";
import Link from "next/link";

export default function NavigateBtn({
  namn,
  routeName,
}: {
  namn: string;
  routeName: string;
}) {
  return (
    <Link
      href={`${routeName}`}
      className="relative flex w-52 items-center justify-center gap-1 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white py-2 text-center shadow outline-2 outline-offset-2 outline-sky-400 focus:outline [&>svg]:hover:w-5 "
    >
      <div>{namn}</div>
      <ArrowRightIcon className="h-5 w-0 transition-all" />
      <Ripples color="black" opacity={0.3} blur={2} on="mouseDown" />
    </Link>
  );
}
