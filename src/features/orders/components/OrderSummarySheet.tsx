'use client';

import { OrderItem } from './OrderItemsList';

interface OrderSummarySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  client: string | null;
  items: OrderItem[];
  installments: number;
}

export function OrderSummarySheet({
  isOpen,
  onClose,
  onConfirm,
  client,
  items,
  installments,
}: OrderSummarySheetProps) {
  if (!isOpen) return null;

  const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const count = installments > 0 ? installments : 1;
  const baseValue = totalAmount / count;

  const generateInstallmentList = () => {
    const list = [];
    const today = new Date();
    today.setMonth(today.getMonth() + 1);

    for (let i = 0; i < count; i++) {
      const targetDate = new Date(today);
      targetDate.setMonth(today.getMonth() + i);
      
      const day = String(targetDate.getDate()).padStart(2, '0');
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const year = targetDate.getFullYear();

      let currentVal = baseValue;
      if (i === count - 1) {
        const sumPrevious = Number((baseValue * (count - 1)).toFixed(2));
        currentVal = totalAmount - sumPrevious;
      }

      list.push({
        number: i + 1,
        dateFormatted: `${day}/${month}/${year}`,
        value: currentVal,
      });
    }
    return list;
  };

  const installmentList = generateInstallmentList();

  const groupedByRep: Record<string, { total: number; segments: Record<string, OrderItem[]> }> = {};

  items.forEach((item) => {
    const rep = item.representative || 'Geral';
    const seg = item.segment || 'Geral';
    const itemTotal = item.price * item.quantity;

    if (!groupedByRep[rep]) {
      groupedByRep[rep] = { total: 0, segments: {} };
    }
    groupedByRep[rep].total += itemTotal;

    if (!groupedByRep[rep].segments[seg]) {
      groupedByRep[rep].segments[seg] = [];
    }
    groupedByRep[rep].segments[seg].push(item);
  });

  const handleWhatsAppShare = () => {
    window.open('https://wa.me/?text=Resumo%20da%20Venda', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto border-l border-stone-200">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Resumo da Venda</span>
              <h2 className="text-xl font-black text-stone-900">Concluir Ordem de Serviço</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Exibindo o cliente selecionado */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Cliente</span>
              <p className="text-sm font-bold text-stone-900 mt-0.5">{client || 'Cliente não identificado'}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase mb-3 block">
                Itens da Venda ({items.length})
              </span>

              {Object.keys(groupedByRep).length === 0 ? (
                <p className="text-xs text-stone-400 italic">Nenhum item adicionado.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedByRep).map(([repName, repData]) => (
                    <div key={repName} className="border-b border-stone-100 pb-3 last:border-none last:pb-0">
                      <div className="flex justify-between items-center text-xs font-black text-stone-900 uppercase">
                        <span>{repName}</span>
                        <span>R$ {repData.total.toFixed(2).replace('.', ',')}</span>
                      </div>

                      <div className="mt-2 pl-3 space-y-2">
                        {Object.entries(repData.segments).map(([segName, segItems]) => {
                          const segTotal = segItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
                          return (
                            <div key={segName}>
                              <div className="flex justify-between text-[11px] font-bold text-stone-600">
                                <span>{segName}</span>
                                <span>R$ {segTotal.toFixed(2).replace('.', ',')}</span>
                              </div>

                              <div className="mt-1 pl-3 space-y-1">
                                {segItems.map((prod) => (
                                  <div key={prod.id} className="flex justify-between text-[11px] text-stone-500">
                                    <span>{prod.name} ({prod.quantity}x)</span>
                                    <span className="font-semibold">R$ {(prod.price * prod.quantity).toFixed(2).replace('.', ',')}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-sm space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase">Forma de Pagamento</span>
                <span className="text-xs font-bold text-orange-600">{count}x parcela(s)</span>
              </div>

              <div className="space-y-2">
                {installmentList.map((inst) => (
                  <div key={inst.number} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center">
                        {inst.number}
                      </div>
                      <span className="font-semibold text-stone-700">{inst.dateFormatted}</span>
                    </div>
                    <span className="font-bold text-stone-900">
                      R$ {inst.value.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-stone-400 uppercase">Total Geral</span>
                <span className="text-base font-black text-stone-900">R$ {totalAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200 mt-6 space-y-2.5">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md shadow-emerald-600/10 transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>💬</span> Compartilhar no WhatsApp
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-orange-500/20 transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>✓</span> Confirmar e Cadastrar Venda · R$ {totalAmount.toFixed(2).replace('.', ',')}
          </button>
        </div>
      </div>
    </div>
  );
}