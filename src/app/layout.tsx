import PlausibleProvider from "next-plausible";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import TopNav from "@/components/layout/TopNav";

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
  const cookieStore = cookies();
  const isDarkModeCookie = cookieStore.get("isDarkMode");
  const isDarkMode = isDarkModeCookie
    ? JSON.parse(isDarkModeCookie?.value)
    : false;

  return (
    <PlausibleProvider domain="https://www.xn--nr-slutar-lektionen-gwb.net/">
      <html lang="en">
        <body className={`${inter.className} ${isDarkMode && "dark"}`}>
          <div
            className={
              "h-[100dvh] w-full overflow-auto bg-gradient-to-tr from-white to-slate-200 text-black selection:bg-sky-600/50 dark:from-slate-800 dark:to-black dark:text-white dark:selection:bg-purple-600/50"
            }
          >
            <TopNav />
            <div className="relative z-10">{children}</div>
            <div className="fixed bottom-12 left-0 right-0 z-0 mx-auto select-none pb-16 text-center font-mono opacity-20">
              <span>hemsida skapad av</span>
              <br />
              <span className="font-bold">Balazs Hevesi</span>
            </div>
            <FavNav />
          </div>
        </body>
      </html>
    </PlausibleProvider>
  );
}
