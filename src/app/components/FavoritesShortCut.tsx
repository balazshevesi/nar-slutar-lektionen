"use client";
import { getCookie } from "../utils/cookeis";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FavoritesShortCut() {
  const listOfFavsCookie = getCookie("listOfFavs") || "[]";
  const listOfFavs = JSON.parse(listOfFavsCookie);

  const [currentlySelected, setCurrentlySelected] = useState("");

  const router = useRouter();

  return (
    <div className=" flex justify-center p-8">
      <select
        onInput={(e) => {
          // @ts-ignore
          setCurrentlySelected(e.target.value);
          // @ts-ignore
          console.log(e.target.value);
          // @ts-ignore
          router.push(e.target.value);
        }}
        id="pet-select"
        placeholder="Dina favoriter"
      >
        <option>Dina favoriter</option>
        {listOfFavs.map((item: any) => {
          return (
            <option value={item} key={0}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
}
