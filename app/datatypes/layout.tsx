import "primereact/resources/themes/lara-light-cyan/theme.css";

import { Metadata } from "next";

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
        <body>{children}</body>
    )
}