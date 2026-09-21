import { OrderHeader } from "./OrderHeader";

export function NewOrderContainer() {
  return (
    <div className="w-full pb-8">
      <OrderHeader />

      {/* Próximos blocos (Cliente, Produtos, etc) virão aqui embaixo */}
    </div>
  );
}