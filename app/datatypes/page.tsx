import FramesContent from '../components/FramesContent';
import HeaderFrame from '../components/HeaderFrame';
import SidePanel from '../components/SidePanel';
import { getDataTypesRoots } from '@api/catalogo/connectionDataTypes';
import { INTERFACE_CONTENT_TYPE } from '../public/utils';

export const revalidate = 300;

export type DataTypeData = Array<[string, string|null]>

async function getDataTypesSidePanelData():Promise<DataTypeData> {
  return await getDataTypesRoots();
}

export default async function Home() {
  const interface_content:INTERFACE_CONTENT_TYPE = "datatypes";
  const data = await getDataTypesSidePanelData();


  return (
    <main className="h-lvh flex">
        <SidePanel sidePanelType={interface_content} data={data} />
        
        <div id="frames-area">
            <HeaderFrame />
            <FramesContent frameContentType={interface_content} />
        </div>
    </main>
  );
}
