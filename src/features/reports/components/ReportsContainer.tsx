'use client';

import { useState, useEffect } from 'react';
import { getOrdersForReport, OrderResponseDTO } from '@/services/reportService';

export function ReportsContainer() {
  const [activeTab, setActiveTab] = useState<'date' | 'client'>('date');
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2026-10-01');
  const [selectedClient, setSelectedClient] = useState('');
  
  // Estado para controlar quais cards estão expandidos
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await getOrdersForReport();
        setOrders(data);
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

  // Lista única de clientes para o filtro por cliente
  const uniqueClients = Array.from(new Set(orders.map(o => o.client?.name).filter(Boolean)));

  // Transformação plana dos dados para exibir cada parcela individualmente nos relatórios
  const reportRows = orders.flatMap((order) => {
    return order.installments.map((inst, index) => {
      const dueDateFormatted = new Date(inst.dueDate).toLocaleDateString('pt-BR');
      const isPast = new Date(inst.dueDate) < new Date();
      const status = inst.status === 'PAID' ? 'pago' : isPast ? 'atrasado' : 'a vencer';

      return {
        id: `${order._id}-${index}`,
        orderId: order._id,
        clientName: order.client?.name || 'Cliente desconhecido',
        installmentLabel: `Parcela ${index + 1} de ${order.installments.length} · ${dueDateFormatted} · R$ ${inst.amount.toFixed(2).replace('.', ',')}`,
        dateKey: inst.dueDate.split('T')[0],
        amount: inst.amount,
        status,
        items: order.items,
      };
    });
  });

  // Filtros aplicados conforme a aba ativa
  const filteredRows = reportRows.filter(row => {
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

      {/* Lista de Registros */}
      {loading ? (
        <div className="text-center py-10 text-xs text-stone-400 italic">Carregando relatórios...</div>
      ) : filteredRows.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl text-center border border-stone-200/60">
          <p className="text-xs text-stone-400 italic">Nenhum recebimento encontrado para este filtro.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRows.map((row) => {
            const isOpen = openCardId === row.id;
            const cardTitle = activeTab === 'date' ? row.clientName : new Date(row.dateKey).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
            
            const badgeBg = row.status === 'atrasado' 
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

                {/* Conteúdo Expandido (Rateio e Produtos) */}
                {isOpen && (
                  <div className="pt-3 border-t border-stone-100 space-y-4 animate-fade-in">
                    <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-stone-200/60 space-y-3">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Rateio e produtos
                      </span>

                      <div className="space-y-3 divide-y divide-stone-100">
                        {row.items.map((item, idx) => (
                          <div key={idx} className={`flex justify-between items-start pt-2 ${idx === 0 ? 'pt-0' : ''}`}>
                            <div>
                              <p className="text-xs font-bold text-stone-900">{item.representative?.name || 'Geral'}</p>
                              <p className="text-[11px] text-stone-500">{item.segment}</p>
                              <p className="text-[11px] text-stone-600 mt-0.5">• {item.productName} · {item.quantity}x</p>
                            </div>
                            <span className="text-xs font-bold text-stone-900">
                              R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Botão Ver Ordem Completa */}
                    <button
                      type="button"
                      onClick={() => alert(`Visualizar ordem completa ID: ${row.orderId}`)}
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