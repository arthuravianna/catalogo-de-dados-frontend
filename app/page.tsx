import Link from "next/link";
import DataCatalogCard from "./components/DataCatalogCard";
import Image from "next/image";
import logoRNP from "@/app/public/logo-rnp.png";

export default async function Home() {

  return (
    <main className="h-lvh">
      <header className="w-full rounded-md top-0 sticky flex justify-center h-fit">
        <div className="max-w-5xl flex gap-8 p-5">
          <Link href="/about" className="hover:underline text-xl font-bold">
            About
          </Link>

          <Link href="/team" className="hover:underline text-xl font-bold">
            Team
          </Link>
        </div>
      </header>

      <div className="w-full flex flex-col items-center gap-16">
        <div className="max-w-[1088px]">
          <div className="title">Catálogo de Dados</div>
          <div className="flex justify-center">
            <Image src={logoRNP} width={128} alt="RNP" />
          </div>

          {/* <div className="subtitle"> geek | smart | curious | nerd </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 content-center">
          <DataCatalogCard 
            href="/datasources" 
            title="Fontes de Dados" 
            subtitle="Explore as fontes de dados da RNP" 
            desc="Explore as diversas fontes de dados da RNP com medições de PoP para PoP e PoP para cliente."
          />

          <DataCatalogCard 
            href="/datatypes" 
            title="Tipos de Dados" 
            subtitle="Explore os tipos de dados da RNP" 
            desc="Explore os diversas tipos de dados que a RNP tem a oferecer."
          />

          <DataCatalogCard 
            href="" 
            title="Glossário de Termos" 
            subtitle="Explore os termos técnicos da RNP" 
            desc=""
            disable={true}
          />

          <DataCatalogCard 
            href="" 
            title="Objetivo do Pesquisador" 
            subtitle="Busque com base em seus objetivos" 
            desc=""
            disable={true}
          />
          <DataCatalogCard 
            href="" 
            title="Casos de Uso" 
            subtitle="Casos de uso do Catálogo analisados" 
            desc=""
            disable={true}
          />
          <DataCatalogCard 
            href="" 
            title="Sugestões de dados" 
            subtitle="Sugira tipos de dados para o Catálogo" 
            desc=""
            disable={true}
          />
        </div>
      </div>
    </main>
  );
}
