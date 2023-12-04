"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import React from "react";

import {
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
  HeartIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

import { setCookie } from "../../utils/client/cookeis";
import { deleteCookie } from "../../utils/client/cookeis";
import { arrayMoveImmutable } from "array-move";

export interface Entry {
  kod: string;
  namn: string;
  pathname: string;
  default: boolean;
  menueIsOpen: boolean;
}

export default function FavNav() {
  !localStorage.getItem("favoriter") &&
    localStorage.setItem("favoriter", JSON.stringify([]));

  const pathname = decodeURI(usePathname());

  const [favoriterState, setFavoriterState] = useState<Entry[]>(
    JSON.parse(localStorage.getItem("favoriter")!),
  );
  const currentCode = pathname.split("/")[3];
  const [isOpen, setIsOpen] = useState(false);

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
      setCookie(
        "superFav",
        JSON.stringify({
          pathname: encodeURI(superFavPathname[0].pathname),
          kod: superFavPathname[0].kod,
          namn: superFavPathname[0].namn,
        }),
      );
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

  const handleRename = (itemToRename: Entry) => {
    const newName =
      prompt(`Döp om ${itemToRename.pathname}`) || itemToRename.namn;
    const newItems = favoriterState.map((item) => {
      if (item.pathname === itemToRename.pathname)
        return { ...item, namn: newName };
      return item;
    });
    setFavoriterState(newItems);
  };

  const handleMoveUp = (itemToMoveUp: Entry) => {
    const indexOfTheItemToMove = favoriterState.findIndex(
      (item) => item === itemToMoveUp,
    );
    const newState = arrayMoveImmutable(
      favoriterState,
      indexOfTheItemToMove,
      indexOfTheItemToMove !== 0
        ? indexOfTheItemToMove - 1
        : indexOfTheItemToMove,
    );
    setFavoriterState(newState);
  };

  const handleMoveDown = (itemToMoveDown: Entry) => {
    const indexOfTheItemToMove = favoriterState.findIndex(
      (item) => item === itemToMoveDown,
    );
    const newState = arrayMoveImmutable(
      favoriterState,
      indexOfTheItemToMove,
      indexOfTheItemToMove !== favoriterState.length
        ? indexOfTheItemToMove + 1
        : indexOfTheItemToMove,
    );
    setFavoriterState(newState);
  };

  const handleOpenMenue = (itemToOpen: Entry) => {
    const newArray = favoriterState.map((item) => {
      const newItem = item;
      newItem.menueIsOpen = false;
      if (item === itemToOpen) newItem.menueIsOpen = true;
      return newItem;
    });
    setFavoriterState(newArray);
  };

  const handleCloseMenue = (itemToClose: Entry) => {
    const newArray = favoriterState.map((item) => {
      const newItem = item;
      newItem.menueIsOpen = false;
      if (item === itemToClose) newItem.menueIsOpen = false;
      return newItem;
    });
    setFavoriterState(newArray);
  };

  const closeAllMenues = () => {
    const newArray = favoriterState.map((item) => {
      const newItem = item;
      newItem.menueIsOpen = false;
      return newItem;
    });
    setFavoriterState(newArray);
  };

  const ListItemMenue = ({ item }: { item: Entry }) => {
    return (
      <div
        className={`${
          item.menueIsOpen ? "" : "translate-x-[calc(100%-36px)]"
        } absolute right-0 flex h-full overflow-hidden rounded-lg shadow transition-all `}
      >
        <button
          onClick={() => {
            item.menueIsOpen ? handleCloseMenue(item) : handleOpenMenue(item);
          }}
          className="bg-slate-50 px-2 hover:bg-slate-100"
        >
          <ChevronUpIcon
            className={`${
              item.menueIsOpen ? "rotate-90" : "-rotate-90"
            } h-5 w-5 transition-all`}
          />
        </button>
        <div className="flex flex-col items-stretch justify-center bg-white">
          <button
            onClick={() => handleMoveUp(item)}
            className=" w-full flex-1 px-2 hover:bg-slate-100"
          >
            <ChevronUpIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleMoveDown(item)}
            className="w-full flex-1 px-2 hover:bg-slate-100"
          >
            <ChevronUpIcon className="h-5 w-5 rotate-180" />
          </button>
        </div>

        <button
          onClick={() => handleRename(item)}
          className=" items-center justify-center bg-white px-4  hover:bg-slate-100"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
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
    );
  };

  function ListItem({ item }: { item: Entry }) {
    return (
      <li
        key={item.kod}
        className="relative flex shrink-0 items-center gap-4 overflow-hidden whitespace-nowrap rounded-lg bg-white shadow"
      >
        <Link
          href={item.pathname}
          onClick={() => {
            setIsOpen(false);
            closeAllMenues();
          }}
          className="w-full px-4 py-2 text-left hover:bg-slate-100"
        >
          <div>
            {item.namn}{" "}
            {item.namn !== item.kod && (
              <span className=" text-sm text-slate-400">({item.kod})</span>
            )}
          </div>
          <div className="text-sm text-slate-300">{item.pathname}</div>
        </Link>
        <ListItemMenue item={item} />
      </li>
    );
  }

  return (
    <div
      className={`${
        isOpen ? "translate-y-0" : "translate-y-[calc(100%-66px)]"
      } bottom AnimateOnLoadFavNav fixed bottom-0 z-50 mx-auto w-full justify-end px-2 transition-all lg:right-4 lg:w-[24rem]`}
    >
      <div className="mx-auto mr-auto flex max-w-sm flex-col rounded-t-xl shadow">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            closeAllMenues();
          }}
          className="relative z-10 flex w-full items-center justify-center gap-1 overflow-hidden rounded-t-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white py-5 text-center outline-2 outline-offset-2 outline-slate-400 focus:outline [&>svg]:hover:w-5"
        >
          <p>Genvägar</p>{" "}
          <ChevronUpIcon
            className={`${isOpen && "rotate-180"} h-5 w-5 transition-all`}
          />
        </button>
        <nav className="relative z-0 bg-slate-100 p-4">
          {currentCode && !currentAdressIsAlredyFav && (
            <button
              onClick={handleAddFav}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-1 text-center shadow"
            >
              <p>Lägg till &quot;{currentCode}&quot;</p>
              <PlusIcon className="h-5 w-5" />
            </button>
          )}
          <ul className="relative mt-4 flex max-h-[40dvh] flex-col gap-2 overflow-auto border-y-2 border-slate-200 px-1 py-4">
            {favoriterState!.map((item: any) => {
              return <ListItem key={item.pathname} item={item} />;
            })}
            {favoriterState.length === 0 && (
              <li className=" text-center text-slate-500">
                Det ser ganska tomt ut här :( <br /> <br />
                Gå till ett schema för att kunna lägga till genvägar
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
