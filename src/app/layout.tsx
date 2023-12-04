import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

import { metadataGlobal } from "../metadata";
import SuperFavRedirect from "./SuperFavRedirect";
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

  return (
    <>
      <SuperFavRedirect />
      <html lang="en">
        <body className={inter.className + " selection:bg-sky-200"}>
          <div className="relative z-10">{children}</div>
          <FavNav />
        </body>
      </html>
    </>
  );
}
