"use client";

import Link from "next/link";

import { useState } from "react";

import { getCookie } from "@/utils/client/cookeis";

import NavigateBtn from "@/components/NavigateBtn";

import { useInterval } from "usehooks-ts";

export default function SuperFavRedirect() {
  const [superFavString, setSuperFavString] = useState(getCookie("superFav"));
  useInterval(() => {
    setSuperFavString(getCookie("superFav"));
  }, 100);

  const superFav = superFavString && JSON.parse(superFavString);

  if (superFav)
    return (
      // <Link
      //   href={superFav.pathname}
      //   className="AnimateOnLoadKeyFrame relative mx-auto flex w-fit items-center justify-center gap-1 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white px-8 py-4 text-center shadow outline-2 outline-offset-2 outline-slate-400 focus:outline [&>svg]:hover:w-5 "
      // >
      //   gå till &quot;{superFav.namn}&quot; ?
      // </Link>
      <div className=" mx-auto w-fit">
        <h2 className="mb-2 text-center text-lg font-medium">Din favorit:</h2>
        <NavigateBtn routeName={superFav.pathname} namn={"" + superFav.namn} />
      </div>
    );
  else return null;
}
