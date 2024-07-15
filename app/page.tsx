import FramesContent from "./components/FramesContent";
import HeaderFrame from "./components/HeaderFrame";
import SidePanel from "./components/SidePanel";


export default async function Home() {

  return (
    <main className="h-lvh flex">
      <SidePanel />
      <div id="frames-area" className="flex-1 flex flex-col gap-2 p-2 h-full">
        <HeaderFrame />
        <FramesContent />
      </div>
    </main>
  );
}
