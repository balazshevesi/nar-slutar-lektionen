import { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

export default function Title2({
  children,
  className,
  noSeperator = false,
}: {
  children: ReactNode;
  className?: string;
  noSeperator?: boolean;
}) {
  return (
    <h2
      className={twMerge(
        "mb-5 flex w-full flex-col text-center text-lg font-medium",
        className,
      )}
    >
      {children}
      {!noSeperator && (
        <div
          aria-hidden
          className=" mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-800"
        ></div>
      )}{" "}
    </h2>
  );
}
