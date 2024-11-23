import SidePanel from '../components/SidePanel';
import TreeFrameDataTypes from '../components/TreeFrameDataTypes';


export default async function Home() {

  return (
    <main className="h-lvh flex">
        <SidePanel sidePanelType='datatypes' />
        
        <div id="frames-area" className="flex-1 flex flex-col gap-2 p-2 h-full">
            <TreeFrameDataTypes/>
        </div>
    </main>
  );
}
