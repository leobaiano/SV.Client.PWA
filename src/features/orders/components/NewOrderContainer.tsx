'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderHeader } from './OrderHeader';
import { OrderClientSection } from './OrderClientSection';
import { OrderProductsSection } from './OrderProductsSection';
import { OrderItemsList, OrderItem } from './OrderItemsList';
import { OrderInstallmentsSection } from './OrderInstallmentsSection';
import { OrderRepresentativeSplitSection } from './OrderRepresentativeSplitSection';
import { OrderSummarySheet } from './OrderSummarySheet';

export function NewOrderContainer() {
  const router = useRouter();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [installments, setInstallments] = useState(1);
  const [client, setClient] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAddItem = (newItem: Omit<OrderItem, 'id'>) => {
    const itemWithId: OrderItem = {
      ...newItem,
      id: Date.now().toString(),
    };
    setItems((prev) => [...prev, itemWithId]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalOrder = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleConfirmSale = () => {
    setIsSheetOpen(false);
    router.push('/?success=true');
  };

  return (
    <div className="w-full pb-12">
      <OrderHeader />
      {/* Passando o estado do cliente e a função de alteração para o componente filho */}
      <OrderClientSection client={client} onClientChange={setClient} />
      <OrderProductsSection onAddProduct={handleAddItem} />
      <OrderItemsList items={items} onRemoveItem={handleRemoveItem} />
      <OrderInstallmentsSection
        totalAmount={totalOrder}
        installments={installments}
        onInstallmentsChange={setInstallments}
      />
      <OrderRepresentativeSplitSection
        items={items}
        installments={installments}
      />

      {/* Botão de Conclusão da Venda */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => {
            if (items.length === 0) {
              alert('Adicione pelo menos um item antes de concluir a venda.');
              return;
            }
            if (!client) {
              alert('Por favor, selecione ou informe o cliente antes de concluir a venda.');
              return;
            }
            setIsSheetOpen(true);
          }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-full text-sm shadow-lg shadow-orange-500/20 transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span>📋</span> Concluir venda · R$ {totalOrder.toFixed(2)}
        </button>
      </div>

      {/* Repassando o cliente preenchido para o resumo */}
      <OrderSummarySheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onConfirm={handleConfirmSale}
        client={client} 
        items={items}
        installments={installments}
      />
    </div>
  );
}