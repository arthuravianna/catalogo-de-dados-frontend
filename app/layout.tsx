import type { Metadata } from "next";
import "./globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import { PrimeReactProvider } from 'primereact/api';
import { SubjectProvider } from "./components/SubjectProvider";

export const metadata: Metadata = {
  title: "Catalogo de Dados",
  description: "Catálogo de Dados RNP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <PrimeReactProvider>
        <SubjectProvider>
          <body>{children}</body>
        </SubjectProvider>
      </PrimeReactProvider>
    </html>
  );
}
