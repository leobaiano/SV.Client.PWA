import { WelcomeHeader } from "@/features/dashboard/components/WelcomeHeader";
import { DashboardActions } from "@/features/dashboard/components/DashboardActions";
import { ReceivablesCard } from "@/features/dashboard/components/ReceivablesCard";

export default function Home() {
  return (
    <div className="pb-6">
      <WelcomeHeader />
      <DashboardActions />
      <ReceivablesCard />
      
      {/* Aqui embaixo entraremos em breve com os blocos de "A Receber Hoje" e "Nova OS" */}
    </div>
  );
}