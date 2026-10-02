'use client';

import { useState } from 'react';

const MOCK_DEBTORS = [
  {
    id: '1',
    clientName: 'Marcos Vieira',
    installmentInfo: 'Parcela 1 · R$ 56,67 · 21/09',
    amount: 56.67,
    status: 'a vencer' as const,
  },
  {
    id: '2',
    clientName: 'Juliana Prado',
    installmentInfo: 'Parcela 2 · R$ 180,00 · 21/09',
    amount: 180.00,
    status: 'atrasado' as const,
  },
  {
    id: '3',
    clientName: 'Márcia Figueiredo',
    installmentInfo: 'Parcela 3 · R$ 103,33 · 21/09',
    amount: 103.33,
    status: 'pago' as const,
  },
];

export function CobrançasContainer() {
  // Período de datas (Início e Fim)
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-30');
  
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  
  // IDs dos devedores selecionados por padrão
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '2']);

  // Template da mensagem
  const [template, setTemplate] = useState(
    'Oi, {nome_cliente}! Tudo bem? Sua parcela de {valor_parcela} vence em {data_vencimento}. Posso te enviar o pix?'
  );

  const toggleSelectDebtor = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Cálculo dos selecionados
  const selectedDebtors = MOCK_DEBTORS.filter((d) => selectedIds.includes(d.id));
  const totalSelectedAmount = selectedDebtors.reduce((acc, curr) => acc + curr.amount, 0);

  // Exemplo de prévia utilizando o primeiro cliente selecionado ou o primeiro da lista
  const previewClient = selectedDebtors[0] || MOCK_DEBTORS[0];
  const previewMessage = template
    .replace('{nome_cliente}', previewClient.clientName.split(' ')[0])
    .replace('{valor_parcela}', `R$ ${previewClient.amount.toFixed(2).replace('.', ',')}`)
    .replace('{data_vencimento}', '21/09');

  const handleSend = () => {
    alert(`Enviando cobranças para ${selectedIds.length} cliente(s) via ${channel.toUpperCase()}!`);
  };

  return (
    <div className="w-full pb-20 space-y-6">
      {/* Cabeçalho */}
      <div>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Cobranças</span>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Lembretes do dia</h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Filtre parcelas por período, revise o texto e envie pelo canal escolhido.
        </p>
      </div>

      {/* Seção Data e Canal */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200/60 space-y-4">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
          Período e canal
        </span>

        {/* Inputs de Período (Data Inicial e Data Final) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-stone-600">Data inicial</label>
            <div className="flex items-center justify-between bg-[#FDFBF7] border border-stone-200 rounded-2xl px-3 py-2.5">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-stone-900 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-stone-600">Data final</label>
            <div className="flex items-center justify-between bg-[#FDFBF7] border border-stone-200 rounded-2xl px-3 py-2.5">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-stone-900 focus:outline-none w-full"
              />
            </div>
          </div>
        </div>

        {/* Seletor de Canal (WhatsApp vs E-mail) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setChannel('whatsapp')}
            className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              channel === 'whatsapp'
                ? 'bg-[#A3E635] text-stone-950 border-[#A3E635] shadow-sm'
                : 'bg-[#FDFBF7] text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>💬</span> WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setChannel('email')}
            className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              channel === 'email'
                ? 'bg-[#A3E635] text-stone-950 border-[#A3E635] shadow-sm'
                : 'bg-[#FDFBF7] text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>✉️</span> E-mail
          </button>
        </div>
      </div>

      {/* Devedores Encontrados */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block px-1">
          Devedores encontrados
        </span>

        <div className="space-y-2.5">
          {MOCK_DEBTORS.map((debtor) => {
            const isSelected = selectedIds.includes(debtor.id);
            const badgeBg =
              debtor.status === 'atrasado'
                ? 'bg-red-100 text-red-700'
                : debtor.status === 'pago'
                ? 'bg-lime-100 text-lime-800'
                : 'bg-amber-100 text-amber-800';

            return (
              <div
                key={debtor.id}
                onClick={() => toggleSelectDebtor(debtor.id)}
                className={`bg-white p-4 rounded-3xl shadow-sm border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected ? 'border-orange-400 ring-1 ring-orange-400/30' : 'border-stone-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-stone-300 bg-stone-50'
                    }`}
                  >
                    {isSelected && <span className="text-xs font-bold">✓</span>}
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-stone-900">{debtor.clientName}</h2>
                    <p className="text-[11px] text-stone-500">{debtor.installmentInfo}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeBg}`}>
                  {debtor.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Template da Mensagem */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200/60 space-y-3">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
          Template
        </span>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-stone-600">Mensagem</label>
          <textarea
            rows={3}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full bg-[#FDFBF7] border border-stone-200 rounded-2xl p-3.5 text-xs font-medium text-stone-900 focus:outline-none focus:border-orange-500 shadow-inner resize-none"
          />
        </div>
      </div>

      {/* Bloco de Prévia e Envio */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200/60 space-y-4">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
          Prévia
        </span>

        {/* Balão de Mensagem Exemplo */}
        <div className="bg-[#FDFBF7] border border-stone-200/80 p-4 rounded-2xl text-xs text-stone-800 leading-relaxed italic shadow-inner">
          &ldquo;{previewMessage}&rdquo;
        </div>

        {/* Sumário de Selecionados */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-stone-600">
            {selectedIds.length} selecionado{selectedIds.length === 1 ? '' : 's'}
          </span>
          <span className="text-sm font-black text-stone-950">
            R$ {totalSelectedAmount.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Botão de Envio */}
        <button
          type="button"
          onClick={handleSend}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl text-sm shadow-lg shadow-orange-500/20 transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span>✈️</span> Revisar e enviar
        </button>
      </div>
    </div>
  );
}