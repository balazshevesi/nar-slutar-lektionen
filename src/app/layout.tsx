import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

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
  console.log("isDarkMode", isDarkMode);

  return (
    <>
      <html lang="en">
        <body
          className={`${inter.className} selection:bg-sky-200 ${
            isDarkMode && "dark"
          }`}
        >
          <div
            className={
              "h-[100dvh] w-full overflow-auto bg-white text-black dark:bg-black dark:text-white"
            }
          >
            <div className="relative z-10">{children}</div>
            <FavNav />
          </div>
        </body>
      </html>
    </>
  );
}
