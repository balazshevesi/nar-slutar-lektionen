"use client";

import { useEffect } from "react";

import { setCookie } from "@/utils/client/cookeis";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

import { useLocalStorage } from "usehooks-ts";

export default function DarkModeToggle() {
  const [isDarkMode, setisDarkMode] = useLocalStorage("darkTheme", true);

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
    <button
      onClick={() => setisDarkMode(!isDarkMode)}
      className="fixed right-0 top-0 w-fit p-4 text-black"
    >
      {isDarkMode ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  );
}
