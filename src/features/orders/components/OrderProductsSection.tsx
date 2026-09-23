'use client';

import { useState } from 'react';

const FAKE_PRODUCTS_DB: Record<string, { price: string; segment: string; representative: string }> = {
  'Perfume Natura Ekos': { price: '64.00', segment: 'Perfumaria', representative: 'Renata' },
  'Batom Romanel': { price: '35.50', segment: 'Cosméticos', representative: 'Renata' },
  'Kit Avon Care': { price: '45.00', segment: 'Cosméticos', representative: 'Renata' },
  'Hidratante Tododia': { price: '52.90', segment: 'Perfumaria', representative: 'Renata' },
};

interface OrderProductsSectionProps {
  onAddProduct: (item: {
    name: string;
    quantity: number;
    price: number;
    segment: string;
    representative: string;
  }) => void;
}

export function OrderProductsSection({ onAddProduct }: OrderProductsSectionProps) {
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [segment, setSegment] = useState('Perfumaria');
  const [representative, setRepresentative] = useState('Renata');

  const productNames = Object.keys(FAKE_PRODUCTS_DB);
  const filteredProducts = productNames.filter(p => 
    p.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectProduct = (prodName: string) => {
    setSelectedProduct(prodName);
    setQuery('');
    setIsOpen(false);

    const details = FAKE_PRODUCTS_DB[prodName];
    if (details) {
      setPrice(details.price);
      setSegment(details.segment);
      setRepresentative(details.representative);
    }
  };

  const handleAdd = () => {
    const productName = selectedProduct || query;
    if (!productName.trim()) {
      alert('Por favor, selecione ou digite o nome do produto.');
      return;
    }

    onAddProduct({
      name: productName,
      quantity: Number(quantity) || 1,
      price: Number(price) || 0,
      segment,
      representative,
    });

    setSelectedProduct(null);
    setQuery('');
    setQuantity('1');
    setPrice('');
  };

  return (
    <div className="mb-6">
      <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
        Produtos e Representantes
      </span>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200/60 space-y-4">
        {/* Campo de Produto com Dropdown Inteligente */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-stone-600 mb-1">Produto</label>
          <div className="flex flex-wrap items-center gap-2 bg-[#FDFBF7] border border-stone-200 rounded-2xl p-3 shadow-inner min-h-[50px]">
            {selectedProduct ? (
              <div className="inline-flex items-center gap-2 bg-white border border-stone-200 text-stone-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                <span>📦 {selectedProduct}</span>
                <button 
                  onClick={() => { 
                    setSelectedProduct(null); 
                    setPrice(''); 
                  }}
                  className="text-stone-400 hover:text-stone-700 font-bold text-sm leading-none ml-0.5"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <span className="text-orange-500 text-sm">✨</span>
                <input 
                  type="text" 
                  placeholder="Digite o nome do produto..." 
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

          {/* Dropdown / Tooltip Flutuante com Fechamento Seguro */}
          {isOpen && !selectedProduct && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-stone-200/80 rounded-2xl shadow-2xl z-30 overflow-hidden py-1 divide-y divide-stone-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <div
                    key={prod}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectProduct(prod)}
                    className="px-4 py-3 text-xs font-medium text-stone-700 hover:bg-orange-50 hover:text-orange-900 cursor-pointer transition-colors flex justify-between items-center"
                  >
                    <span>📦 {prod}</span>
                    <span className="text-[10px] text-stone-400 font-semibold bg-stone-100 px-2 py-0.5 rounded-full">
                      R$ {FAKE_PRODUCTS_DB[prod].price}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3.5 text-xs text-orange-900 bg-orange-50/50 flex items-center gap-2">
                  <span>✨</span>
                  <span>Novo produto: <strong>&quot;{query}&quot;</strong> (será cadastrado)</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quantidade e Preço Unitário */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Qtd.</label>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-stone-200 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-orange-500 shadow-inner"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Preço unitário (R$)</label>
            <input 
              type="text" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#FDFBF7] border border-stone-200 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-orange-500 shadow-inner"
            />
          </div>
        </div>

        {/* Segmento e Representante */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Segmento</label>
            <select 
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-stone-200 rounded-2xl px-3 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-orange-500 shadow-inner"
            >
              <option value="Perfumaria">Perfumaria</option>
              <option value="Cosméticos">Cosméticos</option>
              <option value="Vestuário">Vestuário</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Representante</label>
            <select 
              value={representative}
              onChange={(e) => setRepresentative(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-stone-200 rounded-2xl px-3 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-orange-500 shadow-inner"
            >
              <option value="Renata">Renata</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>

        {/* Botão Adicionar Item */}
        <button 
          type="button"
          onClick={handleAdd}
          className="w-full bg-[#A3E635] hover:bg-[#97d82f] text-stone-950 font-bold py-3 rounded-2xl text-sm shadow-md shadow-lime-500/10 transition-transform active:scale-[0.99] mt-2 flex items-center justify-center gap-1.5"
        >
          <span>+</span> Adicionar item
        </button>
      </div>
    </div>
  );
}