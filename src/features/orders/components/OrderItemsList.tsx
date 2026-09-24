'use client';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  segments: string[];
  representative: string;
}

interface OrderItemsListProps {
  items: OrderItem[];
  onRemoveItem: (id: string) => void;
}

export function OrderItemsList({ items, onRemoveItem }: OrderItemsListProps) {
  const totalOrder = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="mb-6">
      <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
        Itens da OS
      </span>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200/60">
        {items.length === 0 ? (
          <div className="py-6 text-center text-xs text-stone-400 italic">
            Nenhum item adicionado ainda. Preencha acima e clique em &quot;Adicionar item&quot;.
          </div>
        ) : (
          <div className="space-y-3 divide-y divide-stone-100">
            {items.map((item, index) => {
              const itemTotal = item.price * item.quantity;
              const initialLetter = item.representative ? item.representative.charAt(0).toUpperCase() : 'R';
              const segmentsText = item.segments && item.segments.length > 0 ? item.segments.join(', ') : 'Geral';

              return (
                <div key={item.id} className={`flex items-center justify-between pt-3 ${index === 0 ? 'pt-0' : ''}`}>
                  <div className="flex items-center gap-3">
                    {/* Ícone de Letra da Representante */}
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shadow-sm">
                      {initialLetter}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        {item.name} · {item.quantity}x
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {segmentsText} · {item.representative}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-stone-900">
                      R$ {itemTotal.toFixed(2)}
                    </span>
                    <button 
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1"
                      title="Remover item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bloco do Total da OS */}
        <div className="mt-4 pt-3 border-t border-stone-100 bg-[#FDFBF7] p-3.5 rounded-2xl flex items-center justify-between border-stone-200/60">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Total</span>
          <span className="text-lg font-black text-stone-900">
            R$ {totalOrder.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}