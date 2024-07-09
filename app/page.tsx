import SidePanel from "./components/SidePanel";
import TableFrame from "./components/TableFrame";
import TreeFrame from "./components/TreeFrame";

export default async function Home() {

  return (
    <main className="h-lvh flex">
      <SidePanel />
      <div id="frames-area" className="flex-1 flex flex-col gap-2 p-2 h-full">
        <div className="h-12 bg-white p-2 rounded-md w-full"></div>
        <div className="flex-1 grid grid-cols-2 h-[95%] gap-2">
          <TreeFrame />
          <TableFrame />
        </div>
      </div>
    </main>
  );
}
