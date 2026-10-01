'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="flex justify-between items-center py-3 mb-5 w-full border-b border-orange-100/60">
      {/* Lado Esquerdo: Logo e Nome do App direcionando para a página inicial */}
      <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
        <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-transform group-hover:scale-105">
          SV
        </div>
        <span className="font-bold text-stone-900 text-base tracking-tight group-hover:text-orange-600 transition-colors">
          Secretária Virtual
        </span>
      </Link>

      <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center text-amber-950 font-bold text-xs shadow-sm">
        L
      </div>
    </header>
  );
}