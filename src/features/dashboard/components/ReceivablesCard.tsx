import Link from 'next/link';

export function ReceivablesCard() {
  return (
    <div className="mt-6">
      <h3 className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2.5">
        A receber hoje
      </h3>
      
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200/60 flex items-center justify-between">
        <div>
          <p className="text-xs text-stone-600 font-medium">
            3 parcelas vencem hoje
          </p>
          <p className="text-2xl font-black text-stone-900 mt-0.5 tracking-tight">
            R$ 340,00
          </p>
        </div>

        <Link 
          href="/collections"
          className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold px-5 py-2.5 rounded-2xl text-sm shadow-sm transition-transform active:scale-95 flex items-center justify-center"
        >
          Ver
        </Link>
      </div>
    </div>
  );
}