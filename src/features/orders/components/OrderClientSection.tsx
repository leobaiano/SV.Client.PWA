'use client';

import { useState } from 'react';

// Lista fake de clientes para demonstrar a busca e seleção
const FAKE_CLIENTS = [
  'Marcos Vieira',
  'Ana Paula Souza',
  'Carlos Eduardo',
  'Mariana Costa',
  'Roberto Silva',
];

export function OrderClientSection() {
  const [query, setQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Filtra clientes com base na digitação
  const filteredClients = FAKE_CLIENTS.filter(c => 
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mb-6 relative">
      <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
        Cliente
      </span>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200/60 relative">
        {/* Caixa estilo input com tag selecionada ou campo de texto */}
        <div className="flex flex-wrap items-center gap-2 bg-[#FDFBF7] border border-stone-200 rounded-2xl p-3 shadow-inner min-h-[52px]">
          
          {/* Se houver cliente selecionado, exibe como Tag com botão de fechar */}
          {selectedClient ? (
            <div className="inline-flex items-center gap-2 bg-white border border-stone-200 text-stone-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              <span>{selectedClient}</span>
              <button 
                onClick={() => { setSelectedClient(null); setQuery(''); }}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm leading-none ml-0.5"
                title="Remover cliente"
              >
                ×
              </button>
            </div>
          ) : (
            /* Caso contrário, exibe o input de busca */
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
                className="w-full bg-transparent text-sm font-medium text-stone-900 focus:outline-none placeholder:text-stone-400"
              />
            </div>
          )}
        </div>

        {/* Menu Dropdown Flutuante de Sugestões (estilo Medium/Prints) */}
        {isOpen && !selectedClient && (
          <div className="absolute left-4 right-4 mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl z-20 overflow-hidden py-1">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <div
                  key={client}
                  onClick={() => {
                    setSelectedClient(client);
                    setQuery('');
                    setIsOpen(false);
                  }}
                  className="px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-orange-50 hover:text-orange-900 cursor-pointer transition-colors border-b border-stone-50 last:border-none"
                >
                  {client}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-stone-400 italic">
                ✨ Pressione Enter ou clique para criar &quot;{query}&quot;
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}