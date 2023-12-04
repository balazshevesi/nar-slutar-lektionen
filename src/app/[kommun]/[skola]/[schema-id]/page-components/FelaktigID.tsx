import Link from "next/link";

import NavigateBtn from "../../../../../components/general/NavigateBtn";

export default function FelaktigID({
  komun,
  skola,
}: {
  komun: string;
  skola: string;
}) {
  return (
    <>
      <div>Ditt schema id ser ut att vara felaktig</div>
      <NavigateBtn routeName={`/${komun}/${skola}`} namn="Testa igen?" />
    </>
  );
}
