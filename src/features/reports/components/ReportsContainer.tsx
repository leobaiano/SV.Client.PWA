'use client';

import { useState, useEffect } from 'react';
import { getOrdersForReport, OrderResponseDTO } from '@/services/reportService';

export function ReportsContainer() {
  const [activeTab, setActiveTab] = useState<'date' | 'client'>('date');
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Data inicial padrão para o input date (formato YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState('2026-10-20');
  const [selectedClient, setSelectedClient] = useState('');
  
  // Estado para controlar quais cards estão expandidos
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await getOrdersForReport();
        setOrders(data);
        
        // Se houver ordens, define o primeiro cliente como padrão no select
        if (data.length > 0 && data[0].client) {
          setSelectedClient(data[0].client.name);
        }
      } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Extrai lista única de clientes para o filtro por cliente
  const uniqueClients = Array.from(
    new Set(orders.map((o) => o.client?.name).filter(Boolean))
  ) as string[];

  // Transforma o array de ordens em linhas de parcelas individuais para o relatório
  const reportRows = orders.flatMap((order) => {
    return order.installments.map((inst, index) => {
      const dueDateObj = new Date(inst.dueDate);
      const dueDateFormatted = dueDateObj.toLocaleDateString('pt-BR');
      const dateKey = inst.dueDate.split('T')[0]; // Formato YYYY-MM-DD para comparação com o input date
      
      const isPast = dueDateObj < new Date();
      const status = inst.status === 'PAID' ? 'pago' : isPast ? 'atrasado' : 'a vencer';

      return {
        id: `${order._id}-${index}`,
        orderId: order._id,
        clientName: order.client?.name || 'Cliente não identificado',
        installmentLabel: `Parcela ${index + 1} de ${order.installments.length} · ${dueDateFormatted} · R$ ${inst.amount.toFixed(2).replace('.', ',')}`,
        dateKey,
        amount: inst.amount,
        status,
        items: order.items,
      };
    });
  });

  // Filtra as linhas com base na aba ativa (Por data ou Por cliente)
  const filteredRows = reportRows.filter((row) => {
    if (activeTab === 'date') {
      return row.dateKey === selectedDate;
    } else {
      return row.clientName === selectedClient;
    }
  });

  return (
    <div className="w-full pb-16 space-y-6">
      {/* Cabeçalho */}
      <div>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Relatórios</span>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Recebimentos</h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Veja quem paga, qual parcela é e quanto cada representante recebe.
        </p>
      </div>

      {/* Seletor de Abas (Por data / Por cliente) */}
      <div className="bg-white p-1.5 rounded-full shadow-sm border border-stone-200/60 flex gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('date')}
          className={`flex-1 py-3 rounded-full text-xs font-bold transition-all ${
            activeTab === 'date'
              ? 'bg-[#A3E635] text-stone-950 shadow-sm'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Por data
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('client')}
          className={`flex-1 py-3 rounded-full text-xs font-bold transition-all ${
            activeTab === 'client'
              ? 'bg-[#A3E635] text-stone-950 shadow-sm'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Por cliente
        </button>
      </div>

      {/* Seção Dinâmica de Filtro */}
      {activeTab === 'date' ? (
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200/60 space-y-1">
          <label className="block text-[11px] font-bold text-stone-500 uppercase">Data de vencimento</label>
          <div className="flex items-center justify-between bg-[#FDFBF7] border border-stone-200 rounded-2xl px-4 py-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-stone-900 focus:outline-none w-full"
            />
            <span className="text-stone-400">📅</span>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200/60 space-y-1">
          <label className="block text-[11px] font-bold text-stone-500 uppercase">Cliente</label>
          <div className="bg-[#FDFBF7] border border-stone-200 rounded-2xl px-4 py-3">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="bg-transparent text-sm font-bold text-stone-900 focus:outline-none w-full cursor-pointer"
            >
              {uniqueClients.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Lista de Registros / Recebimentos */}
      {loading ? (
        <div className="text-center py-10 text-xs text-stone-400 italic">Carregando relatórios do BFF...</div>
      ) : filteredRows.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl text-center border border-stone-200/60">
          <p className="text-xs text-stone-400 italic">Nenhum recebimento encontrado para este filtro.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRows.map((row) => {
            const isOpen = openCardId === row.id;
            
            // Na visão por data, o título principal é o nome do cliente. Na visão por cliente, é a data formatada.
            const cardTitle =
              activeTab === 'date'
                ? row.clientName
                : new Date(row.dateKey + 'T00:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  });

            const badgeBg =
              row.status === 'atrasado'
                ? 'bg-red-100 text-red-700'
                : row.status === 'pago'
                ? 'bg-lime-100 text-lime-800'
                : 'bg-amber-100 text-amber-800';

            return (
              <div
                key={row.id}
                className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200/60 transition-all space-y-3"
              >
                {/* Topo do Card (Acordeão Header) */}
                <div
                  onClick={() => setOpenCardId(isOpen ? null : row.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-black text-stone-900">{cardTitle}</h2>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeBg}`}>
                        {row.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">{row.installmentLabel}</p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-xs">
                    {isOpen ? '▲' : '▼'}
                  </button>
                </div>

                {/* Conteúdo Expandido (Rateio e Produtos vindos do BFF) */}
                {isOpen && (
                  <div className="pt-3 border-t border-stone-100 space-y-4 animate-fade-in">
                    <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-stone-200/60 space-y-3">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Rateio e produtos
                      </span>

                      <div className="space-y-3 divide-y divide-stone-100">
                        {row.items.map((item, idx) => {
                          const repName = typeof item.representative === 'object' && item.representative !== null
                            ? (item.representative as any).name
                            : 'Representante';

                          return (
                            <div key={idx} className={`flex justify-between items-start pt-2 ${idx === 0 ? 'pt-0' : ''}`}>
                              <div>
                                <p className="text-xs font-bold text-stone-900">{repName}</p>
                                <p className="text-[11px] text-stone-500">{item.segment}</p>
                                <p className="text-[11px] text-stone-600 mt-0.5">
                                  • {item.productName} · {item.quantity}x
                                </p>
                              </div>
                              <span className="text-xs font-bold text-stone-900">
                                R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Botão Ver Ordem Completa */}
                    <button
                      type="button"
                      onClick={() => alert(`Visualizar ordem ID: ${row.orderId}`)}
                      className="w-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold py-3 rounded-2xl text-xs shadow-sm flex items-center justify-between px-4 transition-transform active:scale-[0.99]"
                    >
                      <span>Ver ordem completa</span>
                      <span>›</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}