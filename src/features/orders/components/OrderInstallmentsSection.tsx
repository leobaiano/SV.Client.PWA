'use client';

import { useState } from 'react';

interface OrderInstallmentsSectionProps {
  totalAmount: number;
  installments: number;
  onInstallmentsChange: (value: number) => void;
}

export function OrderInstallmentsSection({
  totalAmount,
  installments,
  onInstallmentsChange,
}: OrderInstallmentsSectionProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(installments.toString());

  // Data padrão inicial: 1 mês após a data de hoje (cadastro)
  const getDefaultFirstDueDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD exigido pelo input date
  };

  const [firstDueDate, setFirstDueDate] = useState(getDefaultFirstDueDate());

  const count = installments > 0 ? installments : 1;
  const baseValue = totalAmount / count;

  // Gera a lista de parcelas com datas baseadas no primeiro vencimento escolhido (1 mês a mais por parcela)
  const generateInstallmentList = () => {
    const list = [];
    const baseDate = firstDueDate ? new Date(firstDueDate + 'T00:00:00') : new Date();

    for (let i = 0; i < count; i++) {
      const targetDate = new Date(baseDate);
      targetDate.setMonth(baseDate.getMonth() + i);

      const day = String(targetDate.getDate()).padStart(2, '0');
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const year = targetDate.getFullYear();

      // Ajuste de centavos na última parcela se houver dízima
      let currentVal = baseValue;
      if (i === count - 1) {
        const sumPrevious = Number((baseValue * (count - 1)).toFixed(2));
        currentVal = totalAmount - sumPrevious;
      }

      list.push({
        number: i + 1,
        dateFormatted: `${day}/${month}/${year}`,
        value: currentVal,
      });
    }
    return list;
  };

  const installmentList = generateInstallmentList();

  const handlePresetClick = (num: number) => {
    setIsCustom(false);
    onInstallmentsChange(num);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomValue(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onInstallmentsChange(parsed);
    } else if (val === '') {
      onInstallmentsChange(1);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
          Parcelamento e Vencimento
        </span>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200/60 space-y-4">
        {/* Campo de Data do Primeiro Vencimento (Calendário) */}
        <div>
          <label className="block text-[11px] font-bold text-stone-600 mb-1">
            Vencimento da 1ª Parcela (Padrão: 30 dias)
          </label>
          <input 
            type="date"
            value={firstDueDate}
            onChange={(e) => setFirstDueDate(e.target.value)}
            className="w-full bg-[#FDFBF7] border border-stone-200 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-orange-500 shadow-inner"
          />
        </div>

        {/* Opções de 1x a 3x + Campo de Texto Livre */}
        <div>
          <label className="block text-[11px] font-bold text-stone-600 mb-1">Quantidade de Parcelas</label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3].map((num) => {
              const isActive = !isCustom && installments === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePresetClick(num)}
                  className={`py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                      : 'bg-[#FDFBF7] text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {num}x
                </button>
              );
            })}

            {/* Campo de texto livre para digitar a quantidade de parcelas */}
            <div className="relative">
              <input
                type="number"
                min="1"
                placeholder="Qtd"
                value={isCustom ? customValue : ''}
                onFocus={() => setIsCustom(true)}
                onChange={handleCustomChange}
                className={`w-full h-full text-center py-2.5 rounded-2xl text-xs font-bold border transition-all focus:outline-none ${
                  isCustom
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20 placeholder:text-white/70'
                    : 'bg-[#FDFBF7] text-stone-700 border-stone-200 placeholder:text-stone-400 hover:bg-stone-100'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Lista de Vencimentos Distribuídos Automaticamente */}
        <div className="space-y-3 pt-2 divide-y divide-stone-100">
          {installmentList.map((inst) => (
            <div key={inst.number} className="flex items-center justify-between pt-3 first:pt-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {inst.number}
                </div>
                <span className="text-xs font-semibold text-stone-700">{inst.dateFormatted}</span>
              </div>
              <span className="text-xs font-bold text-stone-900">
                R$ {inst.value.toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}