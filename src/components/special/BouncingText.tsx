import React from "react";

import { HtmlTagName } from "@/types/HtmlTagName";

export default function BouncingText({
  children,
  tag = "div",
  className,
}: {
  children: string;
  tag?: HtmlTagName;
  className?: string;
}) {
  const array = children.split("");
  //* add these to tw safelist
  //* requires "tailwindcss-animation-delay" plugin
  const arrayOfTWDelays = [
    "animation-delay-none",
    "animation-delay-100",
    "animation-delay-200",
    "animation-delay-300",
    "animation-delay-400",
    "animation-delay-500",
    "animation-delay-600",
    "animation-delay-700",
    "animation-delay-800",
    "animation-delay-900",
  ];

  return React.createElement(
    tag,
    { className: "flex " + className }, //add to tw safelist
    <>
      {/* getto safelist: */}
      {/* <div className="animation-delay-none animation-delay-100 animation-delay-200 animation-delay-300 animation-delay-400 animation-delay-500 animation-delay-600 animation-delay-700 animation-delay-800 animation-delay-900 hidden"></div> */}
      {array.map((character, i) => {
        const delayClass = arrayOfTWDelays[i % arrayOfTWDelays.length];
        return (
          <span
            key={i} // Use index as key
            className={`animate-bounce duration-1000 ${delayClass}`}
          >
            {character}
          </span>
        );
      })}
    </>,
  );
}
