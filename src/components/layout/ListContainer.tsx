"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import NavigateBtn from "../general/NavigateBtn";

export interface ListItem {
  namn: string;
  route: string;
}

export default function ListContainer({
  listItems,
  stuff,
  autoFocus = false,
}: {
  listItems: ListItem[];
  stuff: string;
  autoFocus?: boolean;
}) {
  const [visableList, setVisableList] = useState(listItems);
  const router = useRouter();

  return (
    <>
      <div className="mb-8 flex w-full items-center gap-2">
        <input
          autoFocus={autoFocus}
          type="text"
          placeholder={`Sök bland ${listItems.length} ${stuff}`}
          className="h-10 grow rounded-xl border border-slate-100 bg-gradient-to-t from-slate-100 to-white px-4 text-center shadow outline-2 outline-offset-2 outline-primary focus:outline dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-white"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            // setSchemaId(e.target.value);
            setVisableList((prevState) => {
              return listItems.filter((item) =>
                item.namn.toLowerCase().includes(e.target.value.toLowerCase()),
              );
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              if (visableList.length <= 5) router.push(visableList[0].route);
          }}
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        {visableList.map((item) => {
          return (
            <NavigateBtn
              routeName={item.route}
              namn={item.namn}
              key={item.namn}
            />
          );
        })}{" "}
      </div>
    </>
  );
}
