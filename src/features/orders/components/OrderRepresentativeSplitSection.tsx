'use client';

import { OrderItem } from './OrderItemsList';

interface OrderRepresentativeSplitSectionProps {
  items: OrderItem[];
  installments: number;
}

export function OrderRepresentativeSplitSection({
  items,
  installments,
}: OrderRepresentativeSplitSectionProps) {
  // Agrupa os itens e soma os valores por representante
  const repMap: Record<string, { total: number; products: string[] }> = {};

  items.forEach((item) => {
    const rep = item.representative || 'Geral';
    const itemTotal = item.price * item.quantity;

    if (!repMap[rep]) {
      repMap[rep] = { total: 0, products: [] };
    }

    repMap[rep].total += itemTotal;
    repMap[rep].products.push(`${item.name} (${item.quantity}x)`);
  });

  const representatives = Object.keys(repMap);
  const totalOrderAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const count = installments > 0 ? installments : 1;

  return (
    <div className="mb-6">
      <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
        Rateio por Representante
      </span>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200/60">
        {representatives.length === 0 ? (
          <div className="py-6 text-center text-xs text-stone-400 italic">
            Adicione itens acima para visualizar o rateio proporcional por representante.
          </div>
        ) : (
          <div className="space-y-4 divide-y divide-stone-100">
            {representatives.map((repName, index) => {
              const data = repMap[repName];
              const initialLetter = repName.charAt(0).toUpperCase();
              
              // Proporção do representante em relação ao total da venda
              const proportion = totalOrderAmount > 0 ? data.total / totalOrderAmount : 0;
              
              // Valor total do representante e o valor correspondente a uma parcela
              const repTotalAmount = totalOrderAmount * proportion;
              const installmentValueForRep = repTotalAmount / count;

              return (
                <div key={repName} className={`pt-4 ${index === 0 ? 'pt-0' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Ícone com a inicial do representante */}
                      <div className="w-9 h-9 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {initialLetter}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900">{repName}</p>
                        <p className="text-[11px] text-stone-500 max-w-[200px] truncate">
                          {data.products.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {/* Exibe em destaque o valor da parcela daquele representante */}
                      <p className="text-xs font-bold text-stone-900">
                        R$ {installmentValueForRep.toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {count}x de R$ {installmentValueForRep.toFixed(2).replace('.', ',')} (Total: R$ {repTotalAmount.toFixed(2).replace('.', ',')})
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}