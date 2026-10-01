import { apiFetch } from './api';

export interface CreateOrderPayload {
  clientId: string;
  totalAmount: number;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    segment: string;
    representativeId: string;
  }[];
  installments: {
    dueDate: string; // Ex: "2026-10-20T00:00:00.000Z"
    amount: number;
    representationSplit: never[];
  }[];
}

export interface OrderResponse {
  _id: string;
  totalAmount: number;
  client: any;
  items: any[];
  installments: any[];
  createdAt: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  return apiFetch<OrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}