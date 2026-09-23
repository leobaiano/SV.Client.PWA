import { OrderClientSection } from "./OrderClientSection";
import { OrderHeader } from "./OrderHeader";

export function NewOrderContainer() {
  return (
    <div className="w-full pb-8">
      <OrderHeader />
      <OrderClientSection />

      {/* Próximos blocos (Cliente, Produtos, etc) virão aqui embaixo */}
    </div>
  );
}