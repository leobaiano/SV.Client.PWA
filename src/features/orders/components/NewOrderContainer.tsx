'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderHeader } from './OrderHeader';
import { OrderClientSection } from './OrderClientSection';
import { OrderProductsSection } from './OrderProductsSection';
import { OrderItemsList, OrderItem } from './OrderItemsList';
import { OrderInstallmentsSection } from './OrderInstallmentsSection';
import { OrderSummarySheet } from './OrderSummarySheet';
import { createOrder, CreateOrderPayload } from '@/services/orderService';

export function NewOrderContainer() {
  const router = useRouter();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [installments, setInstallments] = useState(1);
  const [client, setClient] = useState<string | null>(null);
  const [representative, setRepresentative] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // Função que dispara a integração real com o BFF
  const handleConfirmSale = async () => {
    try {
      setIsLoading(true);

      // Mapeamento das parcelas (com 1 mês a frente padrão e split vazio conforme contrato)
      const today = new Date();
      today.setMonth(today.getMonth() + 1);
      const baseValue = totalOrder / (installments > 0 ? installments : 1);

      const installmentsPayload = Array.from({ length: installments > 0 ? installments : 1 }, (_, i) => {
        const dueDateObj = new Date(today);
        dueDateObj.setMonth(today.getMonth() + i);

        let currentAmount = baseValue;
        if (i === installments - 1) {
          const sumPrevious = Number((baseValue * (installments - 1)).toFixed(2));
          currentAmount = totalOrder - sumPrevious;
        }

        return {
          dueDate: dueDateObj.toISOString(),
          amount: Number(currentAmount.toFixed(2)),
          representationSplit: [],
        };
      });

      // Montagem do Payload de Envio (Mapeando strings do MVP para IDs temporários aceitos pelo BFF)
      const payload: CreateOrderPayload = {
        clientId: "6ab053d7d9ca1931a5de7e32", // ID fixo de exemplo do MVP
        totalAmount: Number(totalOrder.toFixed(2)),
        items: items.map((item) => ({
          productId: "6ab0504dd29c709f58516a69", // ID de produto padrão do MVP
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          segment: item.segments && item.segments.length > 0 ? item.segments[0] : "Geral",
          representativeId: "6ab03d591b916732d3c1cfac", // ID de representante padrão do MVP
        })),
        installments: installmentsPayload,
      };

      await createOrder(payload);

      setIsSheetOpen(false);
      router.push('/?success=true');
    } catch (error: any) {
      alert(`Erro ao cadastrar a venda: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full pb-12">
      <OrderHeader />
      <OrderClientSection client={client} onClientChange={setClient} />
      
      <OrderProductsSection
        selectedRepresentative={representative}
        onRepresentativeChange={setRepresentative}
        hasItems={items.length > 0}
        onAddProduct={handleAddItem}
      />

      <OrderItemsList items={items} onRemoveItem={handleRemoveItem} />

      <OrderInstallmentsSection
        totalAmount={totalOrder}
        installments={installments}
        onInstallmentsChange={setInstallments}
      />

      {/* Botão de Conclusão da Venda */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => {
            if (!client) {
              alert('Por favor, selecione ou informe o cliente antes de concluir a venda.');
              return;
            }
            if (!representative) {
              alert('Por favor, selecione o representante da ordem.');
              return;
            }
            if (items.length === 0) {
              alert('Adicione pelo menos um item antes de concluir a venda.');
              return;
            }
            setIsSheetOpen(true);
          }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-full text-sm shadow-lg shadow-orange-500/20 transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span>📋</span> Concluir venda · R$ {totalOrder.toFixed(2)}
        </button>
      </div>

      <OrderSummarySheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onConfirm={handleConfirmSale}
        client={client}
        representative={representative}
        items={items}
        installments={installments}
      />
    </div>
  );
}