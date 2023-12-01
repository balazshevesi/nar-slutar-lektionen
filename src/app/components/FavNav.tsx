"use client";

import {
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

interface Entry {
  kod: string;
  namn: string;
  pathname: string;
  default: boolean;
}

import { setCookie } from "../utils/cookeis";
import { deleteCookie } from "../utils/cookeis";

import Link from "next/link";

export default function FavNav() {
  //! going to fail the build, check if browser g
  //create localstorage key if non-existant
  !localStorage.getItem("favoriter") &&
    localStorage.setItem("favoriter", JSON.stringify([]));

  const pathname = decodeURI(usePathname());

  const [favoriterState, setFavoriterState] = useState<Entry[]>(
    JSON.parse(localStorage.getItem("favoriter")!),
  );
  const currentCode = pathname.split("/")[3];
  const [isOpen, setIsOpen] = useState(false);
  const [selecteTab, setSelecteTab] = useState("Favoriter");

  const currentAdressIsAlredyFav = (() => {
    return (
      favoriterState.filter((item: any) => item.pathname === pathname).length >
      0
    );
  })();

  //sync localStorage and cookies with state
  useEffect(() => {
    //local storage sync
    localStorage.setItem("favoriter", JSON.stringify(favoriterState));

    //cookies sync
    const superFavPathname = favoriterState.filter((item) => item.default);
    superFavPathname.length === 0 && deleteCookie("superFav");
    superFavPathname.length > 0 &&
      setCookie("superFav", encodeURI(superFavPathname[0].pathname));
  }, [favoriterState]);

  const handleAddFav = () => {
    const newFavItem = {
      kod: currentCode,
      namn: currentCode,
      default: false,
      pathname: pathname,
    };
    setFavoriterState((prev: any) => [...prev, newFavItem]);
  };

  const handleRemoveFav = (itemThatWereRemovingFromFav: Entry) => {
    const confirmation = confirm(
      `Är du säker på att du vill ta bort ${itemThatWereRemovingFromFav.namn} ifrån dina favoriter?`,
    );
    const newFavs = favoriterState.filter(
      (item: Entry) => item.pathname !== itemThatWereRemovingFromFav.pathname,
    );
    confirmation && setFavoriterState(newFavs);
  };

  const handleSuperFav = (itemThatWereMakingSuperFav: Entry) => {
    // Check if the superFav has changed
    const superFavHasChanged = !favoriterState.some(
      (item: Entry) =>
        item.pathname === itemThatWereMakingSuperFav.pathname && item.default,
    );
    if (superFavHasChanged) {
      const updatedFavs = favoriterState.map((item: Entry) => {
        if (item.pathname === itemThatWereMakingSuperFav.pathname) {
          return { ...item, default: true };
        } else {
          return { ...item, default: false };
        }
      });
      setFavoriterState(updatedFavs);
    } else {
      const newFavs = favoriterState.map((item: Entry) => {
        item.default = false;
        return item;
      });
      setFavoriterState(newFavs);
    }
  };

  function ListItem({ item }: { item: Entry }) {
    return (
      <div
        key={item.kod}
        className="relative flex shrink-0 items-center gap-4 overflow-auto whitespace-nowrap rounded-lg bg-white shadow"
      >
        <Link
          href={item.pathname}
          className="w-full px-4 py-2 text-left hover:bg-slate-100"
        >
          <div>{item.namn}</div>
          <div className="text-sm text-slate-300">{item.pathname}</div>
        </Link>
        <div className="absolute right-0 flex h-full overflow-hidden rounded-lg shadow">
          <button
            className="items-center justify-center bg-white px-4 hover:bg-slate-100"
            onClick={() => handleSuperFav(item)}
          >
            {item.default ? (
              <HeartIconSolid className="h-5 w-5" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => handleRemoveFav(item)}
            className=" items-center justify-center bg-white px-4  hover:bg-slate-100"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isOpen ? "translate-y-0" : "translate-y-[calc(100%-66px)]"
      } bottom fixed bottom-0 left-0 w-full  justify-center px-2 transition-all`}
    >
      <div className="mx-auto flex max-w-sm flex-col rounded-t-xl shadow">
        <button
          onClick={() => {
            console.log("clicked");
            setIsOpen(!isOpen);
          }}
          className="relative z-10 flex w-full items-center justify-center gap-1 overflow-hidden rounded-t-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white py-5 text-center outline-2 outline-offset-2 outline-slate-400 focus:outline [&>svg]:hover:w-5"
        >
          <p>Genvägar</p>{" "}
          <ChevronUpIcon
            className={`${isOpen && "rotate-180"} h-5 w-5 transition-all`}
          />
        </button>
        <div className="relative z-0 bg-slate-100 p-4">
          {currentCode && !currentAdressIsAlredyFav && (
            <button
              onClick={handleAddFav}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-1 text-center shadow"
            >
              <p>Lägg till &quot;{currentCode}&quot;</p>
              <PlusIcon className=" h-5 w-5" />
            </button>
          )}
          <div className="relative mt-4 flex max-h-[40dvh] flex-col gap-2 overflow-auto border-y-2 border-slate-200 px-1 py-4">
            {favoriterState!.map((item: any) => {
              return <ListItem key={0} item={item} />;
            })}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
