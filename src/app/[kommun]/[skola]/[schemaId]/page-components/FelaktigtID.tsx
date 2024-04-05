import Link from "next/link";

import Title2 from "@/components/general/Title2";

import NavigateBtn from "../../../../../components/general/NavigateBtn";

export default function FelaktigtID({
  kommun,
  skola,
}: {
  kommun: string;
  skola: string;
}) {
  return (
    <div className=" w-full">
      <Title2>Ditt schema id är felaktigt</Title2>
      <NavigateBtn routeName={`/${kommun}/${skola}`} namn="Testa igen?" />
    </div>
  );
}
