import Link from 'next/link';

export function DashboardActions() {
  return (
    <div className="flex flex-col gap-3.5 mb-6">
      {/* Card Grande: Nova Venda */}
      <Link 
        href="/orders/new"
        className="bg-orange-500 hover:bg-orange-600 text-white p-5 rounded-3xl shadow-lg shadow-orange-500/20 flex items-center justify-between transition-transform active:scale-[0.99] group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-light">
            +
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Nova venda</h2>
            <p className="text-orange-100 text-xs mt-0.5">abre direto no lançamento</p>
          </div>
        </div>
        <span className="text-white/80 group-hover:translate-x-1 transition-transform text-lg mr-1">→</span>
      </Link>

      {/* Grid Inferior: Relatórios e Cobranças */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Relatórios */}
        <Link 
          href="/reports"
          className="bg-[#A3E635] hover:bg-[#97d82f] text-stone-900 p-4 rounded-3xl shadow-md shadow-lime-500/10 flex flex-col justify-between h-32 transition-transform active:scale-[0.98]"
        >
          <div className="w-8 h-8 bg-stone-900/10 rounded-xl flex items-center justify-center text-base">
            📋
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Relatórios</h3>
            <p className="text-stone-800/80 text-[11px] mt-0.5">por data e cliente</p>
          </div>
        </Link>

        {/* Cobranças */}
        <Link 
          href="/collections"
          className="bg-[#06B6D4] hover:bg-[#0891b2] text-white p-4 rounded-3xl shadow-md shadow-cyan-500/10 flex flex-col justify-between h-32 transition-transform active:scale-[0.98]"
        >
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-base">
            📤
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Cobranças</h3>
            <p className="text-cyan-100 text-[11px] mt-0.5">WhatsApp e e-mail</p>
          </div>
        </Link>
      </div>
    </div>
  );
}