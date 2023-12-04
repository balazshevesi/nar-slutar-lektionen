"use client";

import { useEffect, useState } from "react";

import { getCookie, setCookie } from "@/utils/client/cookeis";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function DarkModeToggle({ className }: { className?: string }) {
  const [isDarkMode, setisDarkMode] = useState(
    JSON.parse(getCookie("isDarkMode") || "false"),
  );

  //sync html body, and cookies with state
  useEffect(() => {
    isDarkMode
      ? document.body.classList.add("dark")
      : document.body.classList.remove("dark");
    isDarkMode
      ? setCookie("isDarkMode", "true")
      : setCookie("isDarkMode", "false");
  }, [isDarkMode]);

  return (
    <button onClick={() => setisDarkMode(!isDarkMode)} className={className}>
      {isDarkMode ? (
        <SunIcon className="heroicon-sw-2 h-6 w-6" />
      ) : (
        <MoonIcon className="heroicon-sw-2 h-6 w-6" />
      )}
    </button>
  );
}
