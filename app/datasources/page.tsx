import FramesContent from "@/app/components/FramesContent";
import HeaderFrame from "@/app/components/HeaderFrame";
import SidePanel from "@/app/components/SidePanel";
import { query_namespace_datasources, query_navigable_namespaces } from '../public/connectionDataSources';
import { NameWithCaption, VIEW } from '../public/connectionTypesDefinitions';
import { INTERFACE_CONTENT_TYPE } from "../public/utils";

export const revalidate = 300;

export type RootDataSource = Array<NameWithCaption>|null;
export type DataSources = Record<string, Array<NameWithCaption>>;

export interface DataSourceData {
    rootDataSources:RootDataSource,
    dataSources:DataSources
}

async function getDataSourcesSidePanelData():Promise<DataSourceData> {
  let data:DataSourceData = {
    rootDataSources: await query_navigable_namespaces(VIEW.STRUCTURAL),
    dataSources: {}
  }
  if (!data.rootDataSources) return data;

  for (let namespace of data.rootDataSources) {
      //if (!namespaceDataSources[namespace.namespace]) namespaceDataSources[namespace.namespace] = [];

      const sources = await query_namespace_datasources(namespace.name);
      data.dataSources[namespace.name] = sources;
  }

  return data;
}


export default async function Home() {
  const interface_content:INTERFACE_CONTENT_TYPE = "datasources";
  const data = await getDataSourcesSidePanelData();

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
