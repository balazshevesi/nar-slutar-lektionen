import Bread from "./components/Bread";
import NavigateBtn from "./components/NavigateBtn";
export default function Home() {
  return (
    <div className="flex h-[100dvh] flex-col items-center p-8">
      <Bread />
      <h2 className="mb-2 text-lg font-medium">Välj din kommun:</h2>
      <div className="flex flex-col gap-2">
        <NavigateBtn namn="Älmhult" routeName="/almhult" />
      </div>
    </div>
  );
}
