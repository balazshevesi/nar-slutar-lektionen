import { Inter } from "next/font/google";
import "./globals.css";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import FavNav from "../components/FavNav";
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
        {/* <FavoritesShortCut /> */}
        {children}
        <FavNav />
      </body>
    </html>
  );
}
