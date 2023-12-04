import Link from "next/link";

import { ArrowRightIcon } from "@heroicons/react/24/solid";

/**
 * * "namn" 𝘮𝘶𝘴𝘵 be included in the "routeName"
 */
export default function NavigateBtn({
  namn,
  routeName,
}: {
  namn: string;
  routeName: string;
}) {
  const includesASlash = namn.includes("/");
  const decodedRouteName = decodeURI(routeName);
  const includesASlashRoute = decodedRouteName.replace(
    namn,
    encodeURIComponent(namn),
  );

  return (
    <Link
      href={`${includesASlash ? includesASlashRoute : routeName}`}
      className="relative flex w-full items-center justify-center gap-1 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white px-6 py-2 text-center shadow outline-2 outline-offset-2 outline-slate-400 focus:outline dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-white dark:outline-slate-500 [&>svg]:hover:w-5"
    >
      <div>{namn}</div>
      <ArrowRightIcon className="h-5 w-0 transition-all" />
    </Link>
  );
}
