import type { Metadata } from "next";
import "./globals.css";
import { RequestsCartProvider } from "@/app/context/RequestsCart";

export const metadata: Metadata = {
  title: {
    template: "%s | Catalogo de Dados",
    default: "Catalogo de Dados"
  },
  description: "Catálogo de Dados RNP",

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <RequestsCartProvider>
        <body>{children}</body>
      </RequestsCartProvider>
    </html>
  );
}
