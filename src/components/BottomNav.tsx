'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/95 backdrop-blur-md border border-orange-100 shadow-2xl rounded-full px-4 py-2.5 flex justify-between items-center z-50">
      {/* Início */}
      <Link 
        href="/" 
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-2xl transition-all ${pathname === '/' ? 'text-orange-600 font-semibold bg-orange-50/80' : 'text-stone-400 hover:text-stone-700'}`}
      >
        <span className="text-xl">🏠</span>
        <span className="text-[10px] mt-0.5 tracking-tight">Início</span>
      </Link>

      {/* Venda (Botão Central 1) */}
      <Link 
        href="/orders/new" 
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-2xl transition-all ${pathname === '/orders/new' ? 'text-orange-600 font-semibold bg-orange-50/80' : 'text-stone-400 hover:text-stone-700'}`}
      >
        <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-base font-bold shadow-md shadow-orange-500/30">
          +
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Venda</span>
      </Link>

      {/* Relatórios */}
      <Link 
        href="/reports" 
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-2xl transition-all ${pathname === '/reports' ? 'text-orange-600 font-semibold bg-orange-50/80' : 'text-stone-400 hover:text-stone-700'}`}
      >
        <span className="text-xl">📊</span>
        <span className="text-[10px] mt-0.5 tracking-tight">Relat.</span>
      </Link>

      {/* Cobranças */}
      <Link 
        href="/collections" 
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-2xl transition-all ${pathname === '/collections' ? 'text-orange-600 font-semibold bg-orange-50/80' : 'text-stone-400 hover:text-stone-700'}`}
      >
        <span className="text-xl">✉️</span>
        <span className="text-[10px] mt-0.5 tracking-tight">Cobr.</span>
      </Link>
    </nav>
  );
}