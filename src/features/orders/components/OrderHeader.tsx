export function OrderHeader() {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
            NOVA OS . HOJE
        </span>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-0.5">
          Adicionar venda
        </h1>
        <p className="text-xs text-stone-600 mt-1 max-w-65 leading-relaxed">
          Digite cliente e produtos. Se não existir, o SV cria no final.
        </p>
      </div>

      {/* Tag Type-to-Create */}
      <div className="bg-lime-200/80 border border-lime-300 text-stone-900 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm text-center">
        Type-to-<br />Create
      </div>
    </div>
  );
}