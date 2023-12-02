import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Bread from "@/components/layout/Bread";

import { metadataGlobal } from "../metadata";
import "./globals.css";

//disable ssr for FavNav
const FavNav = dynamic(() => import("../components/layout/FavNav"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });
export const metadata = metadataGlobal;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //super fav functionallity
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const cookieStore = cookies();
  const superFavCookie = cookieStore.get("superFav");
  const superFavURL = superFavCookie ? decodeURI(superFavCookie?.value) : null;
  superFavURL && pathname === "/" && redirect(superFavURL);

  return (
    <html lang="en">
      <body className={inter.className + " selection:bg-sky-200"}>
        <div className="relative z-10">{children}</div>
        <FavNav />
      </body>
    </html>
  );
}
