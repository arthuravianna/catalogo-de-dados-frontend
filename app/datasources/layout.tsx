import "primereact/resources/themes/lara-light-cyan/theme.css";

import { PrimeReactProvider } from 'primereact/api';
import { SubjectProvider } from "@/app/components/SubjectProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Fontes de Dados',
  description: 'Fontes de Dados da RNP',
}

export default async function DatasourcesLayout({
    children
  }: {
    children: React.ReactNode
  }) {


    return (
      <PrimeReactProvider>
        <SubjectProvider>
          <body>{children}</body>
        </SubjectProvider>
      </PrimeReactProvider>
    )
  }