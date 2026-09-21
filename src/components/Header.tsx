export function Header() {
  return (
    <header className="flex justify-between items-center py-3 mb-5 w-full border-b border-orange-100/60">
      {/* Lado Esquerdo: Logo e Nome do App */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-500/20">
          SV
        </div>
        <span className="font-bold text-stone-900 text-base tracking-tight">
          Secretária Virtual
        </span>
      </div>

      <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center text-amber-950 font-bold text-xs shadow-sm">
        RS
      </div>
    </header>
  );
}