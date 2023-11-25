"use client";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useState } from "react";

import { setCookie } from "@/app/utils/cookeis";
import { getCookie } from "@/app/utils/cookeis";
import { deleteCookie } from "@/app/utils/cookeis";

export default function Favourite({
  schemaId,
  isFavouriteProp = false,
  listOfFavsProp,
}: {
  isFavouriteProp?: boolean;
  schemaId: string;
  listOfFavsProp: any;
}) {
  if (!listOfFavsProp) setCookie("listOfFavs", "[]");

  const [listOfFavs, setListOfFavs] = useState(
    !listOfFavsProp ? "[]" : JSON.parse(listOfFavsProp.value),
  );

  const pathname = window.location.pathname;
  const [isFavourite, setIsFavourite] = useState(listOfFavs.includes(pathname));

  return (
    <button
      onClick={() => {
        if (!isFavourite) {
          // Create a new array with the new favorite added
          const newListOfFavs = [...listOfFavs, pathname];
          setCookie("listOfFavs", JSON.stringify(newListOfFavs));
        } else {
          // Filter out the item to remove it from favorites
          const newListOfFavs = listOfFavs.filter(
            (item: string) => item !== pathname,
          );
          setCookie("listOfFavs", JSON.stringify(newListOfFavs));
        }
        setIsFavourite(!isFavourite);
      }}
      className=" transition-all active:scale-95"
    >
      {isFavourite ? (
        <HeartIconSolid className=" heroicon-sw-2.5 h-5 w-5" />
      ) : (
        <HeartIconOutline className=" heroicon-sw-2.5 h-5 w-5" />
      )}{" "}
    </button>
  );
}
