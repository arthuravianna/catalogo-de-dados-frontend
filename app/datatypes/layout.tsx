import "primereact/resources/themes/lara-light-cyan/theme.css";

import { Metadata } from "next";
import { PrimeReactProvider } from "primereact/api";
import { SubjectProvider } from "../components/SubjectProvider";

export const metadata: Metadata = {
  title: 'Tipos de Dados',
  description: 'Tipos de Dados da RNP',
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