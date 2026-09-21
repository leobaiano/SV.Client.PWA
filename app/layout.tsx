import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

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
      <body className={`${inter.className} bg-[#FDFBF7] text-stone-800 antialiased min-h-screen pb-24`}>
        <main className="max-w-md mx-auto px-4 pt-6">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}