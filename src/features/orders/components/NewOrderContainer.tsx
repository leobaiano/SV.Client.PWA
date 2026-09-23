'use client';

import { useState } from 'react';
import { OrderHeader } from './OrderHeader';
import { OrderClientSection } from './OrderClientSection';
import { OrderProductsSection } from './OrderProductsSection';
import { OrderItemsList, OrderItem } from './OrderItemsList';
import { OrderInstallmentsSection } from './OrderInstallmentsSection';

export function NewOrderContainer() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [installments, setInstallments] = useState(1);

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

  return (
    <div className="w-full pb-8">
      <OrderHeader />
      <OrderClientSection />
      <OrderProductsSection onAddProduct={handleAddItem} />
      <OrderItemsList items={items} onRemoveItem={handleRemoveItem} />
      
      {/* Seção de Parcelamento Dinâmico */}
      <OrderInstallmentsSection 
        totalAmount={totalOrder}
        installments={installments}
        onInstallmentsChange={setInstallments}
      />
    </div>
  );
}