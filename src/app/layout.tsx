import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

//disable ssr for FavNav
const FavNav = dynamic(() => import("../components/FavNav"), {
  ssr: false,
});
import { headers } from "next/headers";
import { metadataGlobal } from "../metadata";

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
        <div className=" relative z-10">{children}</div>
        <FavNav />
      </body>
    </html>
  );
}
