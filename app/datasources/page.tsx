import FramesContent from "@/app/components/FramesContent";
import HeaderFrame from "@/app/components/HeaderFrame";
import SidePanel from "@/app/components/SidePanel";
import { INTERFACE_CONTENT_TYPE } from "../public/utils";


export default async function Home() {
  const interface_content:INTERFACE_CONTENT_TYPE = "datasources";

  return (
    <main className="h-lvh flex">
      <SidePanel sidePanelType={interface_content} />
      <div id="frames-area">
        <HeaderFrame />
        <FramesContent frameContentType={interface_content} />
      </div>
    </main>
  );
}
