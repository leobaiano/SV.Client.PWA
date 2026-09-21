import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SV - Secretária Virtual",
  description: "Gestão de Vendas e Representações",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#FDFBF7] text-stone-800 antialiased min-h-screen flex flex-col items-center`}>
        {/* Container Central do App */}
        <div className="w-full max-w-2xl px-4 sm:px-6 pt-4 pb-24 flex-1 flex flex-col justify-between">
          <div>
            <Header />
            <main className="w-full">{children}</main>
          </div>
          
          {/* Barra de Navegação Integrada no Fluxo */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}