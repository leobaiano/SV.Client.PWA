'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WelcomeHeader } from "@/features/dashboard/components/WelcomeHeader";
import { DashboardActions } from "@/features/dashboard/components/DashboardActions";
import { ReceivablesCard } from "@/features/dashboard/components/ReceivablesCard";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const successParam = searchParams.get('success');

  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    if (successParam === 'true') {
      setShowToolbar(true);

      const timer = setTimeout(() => {
        setShowToolbar(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successParam]);

  const handleCloseToolbar = () => {
    setShowToolbar(false);
    router.replace('/');
  };

  return (
    <div className="pb-6">
      {showToolbar && (
        <div className="mb-4 bg-lime-200 border border-lime-300 text-stone-900 px-4 py-3 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lime-700 font-bold">✨</span>
            <span className="text-xs font-bold">Venda cadastrada com sucesso!</span>
          </div>
          <button 
            onClick={handleCloseToolbar}
            className="text-stone-600 hover:text-stone-900 font-bold text-sm px-1.5"
            title="Fechar"
          >
            ×
          </button>
        </div>
      )}

      <WelcomeHeader />
      <DashboardActions />
      <ReceivablesCard />
      
      {/* Aqui embaixo entraremos em breve com os blocos de "A Receber Hoje" e "Nova OS" */}
    </div>
  );
}