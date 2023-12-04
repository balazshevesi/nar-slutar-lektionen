"use client";

import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";

import { getCookie } from "@/utils/client/cookeis";

export default function SuperFavRedirect() {
  //super fav functionallity
  const pathname = usePathname();
  console.log("pathname", pathname);
  const superFavCookie = getCookie("superFav");
  const superFavURL = superFavCookie ? decodeURI(superFavCookie) : null;
  console.log("superFavURL", superFavURL);
  superFavURL && pathname === "/" && redirect(superFavURL);
  return <></>;
}
