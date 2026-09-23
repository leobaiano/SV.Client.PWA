'use client';

import { useState } from 'react';

const FAKE_CLIENTS = [
  'Marcos Vieira',
  'Ana Paula Souza',
  'Carlos Eduardo',
  'Mariana Costa',
  'Roberto Silva',
];

interface OrderClientSectionProps {
  client: string | null;
  onClientChange: (clientName: string | null) => void;
}

export function OrderClientSection({ client, onClientChange }: OrderClientSectionProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredClients = FAKE_CLIENTS.filter(c => 
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mb-6 relative">
      <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
        Cliente
      </span>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200/60 relative">
        <div className="flex flex-wrap items-center gap-2 bg-[#FDFBF7] border border-stone-200 rounded-2xl p-3 shadow-inner min-h-[52px]">
          {client ? (
            <div className="inline-flex items-center gap-2 bg-white border border-stone-200 text-stone-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              <span>{client}</span>
              <button 
                type="button"
                onClick={() => { 
                  onClientChange(null); 
                  setQuery(''); 
                }}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm leading-none ml-0.5"
                title="Remover cliente"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <span className="text-orange-500 text-sm">🔍</span>
              <input 
                type="text" 
                placeholder="Digite o nome do cliente..." 
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => {
                  setTimeout(() => setIsOpen(false), 200);
                }}
                className="w-full bg-transparent text-sm font-medium text-stone-900 focus:outline-none placeholder:text-stone-400"
              />
            </div>
          )}
        </div>

        {isOpen && !client && (
          <div className="absolute left-4 right-4 mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl z-20 overflow-hidden py-1">
            {filteredClients.length > 0 ? (
              filteredClients.map((clientName) => (
                <div
                  key={clientName}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onClientChange(clientName);
                    setQuery('');
                    setIsOpen(false);
                  }}
                  className="px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-orange-50 hover:text-orange-900 cursor-pointer transition-colors border-b border-stone-50 last:border-none"
                >
                  {clientName}
                </div>
              ))
            ) : (
              <div 
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (query.trim()) {
                    onClientChange(query.trim());
                    setQuery('');
                    setIsOpen(false);
                  }
                }}
                className="px-4 py-3 text-xs text-orange-900 bg-orange-50/50 cursor-pointer"
              >
                ✨ Clique para selecionar &quot;{query}&quot;
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}