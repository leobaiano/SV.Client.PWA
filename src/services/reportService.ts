import { apiFetch } from './api';

export interface OrderResponseDTO {
  _id: string;
  client: {
    _id: string;
    name: string;
    phone: string;
    email: string;
  };
  totalAmount: number;
  items: {
    productName: string;
    segment: string;
    price: number;
    quantity: number;
    representative: {
      _id: string;
      name: string;
    };
  }[];
  installments: {
    dueDate: string;
    amount: number;
    status: string;
    representationSplit: {
      representative: string;
      amount: number;
    }[];
  }[];
  createdAt: string;
}

export async function getOrdersForReport(): Promise<OrderResponseDTO[]> {
  return apiFetch<OrderResponseDTO[]>('/orders');
}