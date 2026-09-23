import { OrderClientSection } from "./OrderClientSection";
import { OrderHeader } from "./OrderHeader";
import { OrderProductsSection } from "./OrderProductsSection";

export function NewOrderContainer() {
  return (
    <div className="w-full pb-8">
      <OrderHeader />
      <OrderClientSection />
      <OrderProductsSection />

      {/* Próximos blocos (Cliente, Produtos, etc) virão aqui embaixo */}
    </div>
  );
}