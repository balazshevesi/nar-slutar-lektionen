import NavigateBtn from "../components/NavigateBtn";
import Bread from "../components/Bread";

export default function Page({ params }: { params: { kommun: string } }) {
  const kommun = params.kommun;
  return (
    <div className="flex h-[100dvh] flex-col items-center p-8">
      <Bread kommun={kommun} />
      <h2 className="mb-2 text-lg font-medium">Välj din skola:</h2>
      <div className=" flex flex-col gap-2">
        <NavigateBtn
          namn="Haganässkolan"
          routeName={`${kommun}/haganasskolan`}
        />
      </div>
    </div>
  );
}
