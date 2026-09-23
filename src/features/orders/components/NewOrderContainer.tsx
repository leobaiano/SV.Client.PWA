'use client';

import { useState } from 'react';
import { OrderHeader } from './OrderHeader';
import { OrderClientSection } from './OrderClientSection';
import { OrderProductsSection } from './OrderProductsSection';
import { OrderItemsList, OrderItem } from './OrderItemsList';

export function NewOrderContainer() {
  const [items, setItems] = useState<OrderItem[]>([]);

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

  return (
    <div className="w-full pb-8">
      <OrderHeader />
      <OrderClientSection />
      <OrderProductsSection onAddProduct={handleAddItem} />
      <OrderItemsList items={items} onRemoveItem={handleRemoveItem} />
    </div>
  );
}