'use client';

import { useState } from 'react';

const FAKE_PRODUCTS_DB: Record<string, { price: string; segment: string; representative: string }> = {
  'Perfume Natura Ekos': { price: '64.00', segment: 'Perfumaria', representative: 'Natura & Avon' },
  'Batom Romance': { price: '35.50', segment: 'Cosméticos', representative: 'Romance' },
  'Kit Avon Care': { price: '45.00', segment: 'Cosméticos', representative: 'Natura & Avon' },
  'Hidratante Tododia': { price: '52.90', segment: 'Perfumaria', representative: 'Natura & Avon' },
};

const FAKE_REPRESENTATIVES = ['Natura & Avon', 'Romance'];
const FAKE_SEGMENTS = ['Perfumaria', 'Cosméticos', 'Vestuário'];

interface OrderProductsSectionProps {
  selectedRepresentative: string | null;
  onRepresentativeChange: (rep: string | null) => void;
  hasItems: boolean;
  onAddProduct: (item: {
    name: string;
    quantity: number;
    price: number;
    segments: string[];
    representative: string;
  }) => void;
}

export function OrderProductsSection({
  selectedRepresentative,
  onRepresentativeChange,
  hasItems,
  onAddProduct,
}: OrderProductsSectionProps) {
  // Estados do Representante (Autocomplete)
  const [repQuery, setRepQuery] = useState('');
  const [isRepOpen, setIsRepOpen] = useState(false);

  // Estados do Produto (Autocomplete)
  const [productQuery, setProductQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);

  // Demais campos do item
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [segmentQuery, setSegmentQuery] = useState('');
  const [isSegmentOpen, setIsSegmentOpen] = useState(false);

  // Verifica se o representante digitado é novo
  const isNewRepresentative = repQuery.trim() !== '' && !FAKE_REPRESENTATIVES.some(
    r => r.toLowerCase() === repQuery.trim().toLowerCase()
  );

  const filteredReps = FAKE_REPRESENTATIVES.filter(r =>
    r.toLowerCase().includes(repQuery.toLowerCase())
  );

  const isProductEnabled = Boolean(selectedRepresentative || repQuery.trim());

  const availableProducts = selectedRepresentative 
    ? Object.entries(FAKE_PRODUCTS_DB).filter(([_, details]) => details.representative === selectedRepresentative)
    : [];

  const filteredProducts = availableProducts.filter(([name]) =>
    name.toLowerCase().includes(productQuery.toLowerCase())
  );

  const filteredSegments = FAKE_SEGMENTS.filter(seg =>
    seg.toLowerCase().includes(segmentQuery.toLowerCase()) && !selectedSegments.includes(seg)
  );

  const handleSelectProduct = (prodName: string) => {
    setSelectedProduct(prodName);
    setProductQuery('');
    setIsProductOpen(false);

    const details = FAKE_PRODUCTS_DB[prodName];
    if (details) {
      setPrice(details.price);
      if (!selectedRepresentative) {
        onRepresentativeChange(details.representative);
      }
      if (!selectedSegments.includes(details.segment)) {
        setSelectedSegments([...selectedSegments, details.segment]);
      }
    }
  };

  const handleAdd = () => {
    const currentRep = selectedRepresentative || repQuery.trim();
    const productName = selectedProduct || productQuery.trim();
    
    // Se houver texto digitado no campo de segmento que ainda não foi adicionado como tag, adiciona automaticamente
    let finalSegments = [...selectedSegments];
    if (segmentQuery.trim() && !finalSegments.includes(segmentQuery.trim())) {
      finalSegments.push(segmentQuery.trim());
    }

    const numericPrice = parseFloat(price.replace(',', '.')) || 0;

    if (!currentRep) {
      alert('Por favor, selecione ou informe o representante da ordem.');
      return;
    }
    if (!productName) {
      alert('Por favor, selecione ou digite o nome do produto.');
      return;
    }
    if (numericPrice <= 0) {
      alert('O preço unitário do produto deve ser maior que zero (R$ 0,00 não é permitido).');
      return;
    }
    if (finalSegments.length === 0) {
      alert('Selecione ou digite pelo menos um segmento para o produto.');
      return;
    }

    if (!selectedRepresentative) {
      onRepresentativeChange(currentRep);
    }

    onAddProduct({
      name: productName,
      quantity: Number(quantity) || 1,
      price: numericPrice,
      segments: finalSegments,
      representative: currentRep,
    });

    // Reseta os campos do produto
    setSelectedProduct(null);
    setProductQuery('');
    setQuantity('1');
    setPrice('');
    setSelectedSegments([]);
    setSegmentQuery('');
  };

  return (
    <div className="mb-6 space-y-4">
      {/* 1. CAMPO REPRESENTANTE */}
      <div className="relative">
        <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
          Representante da OS
        </span>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200/60 relative">
          <div className="flex flex-wrap items-center gap-2 bg-[#FDFBF7] border border-stone-200 rounded-2xl p-3 shadow-inner min-h-[52px]">
            {selectedRepresentative ? (
              <div className="inline-flex items-center gap-2 bg-white border border-stone-200 text-stone-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                <span>👤 {selectedRepresentative}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (hasItems) {
                      alert('Para trocar de representante, remova todos os produtos da OS primeiro.');
                      return;
                    }
                    onRepresentativeChange(null);
                    setRepQuery('');
                  }}
                  className="text-stone-400 hover:text-stone-700 font-bold text-sm leading-none ml-0.5"
                  title="Trocar representante"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <span className="text-orange-500 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Selecione ou digite um novo representante..."
                  value={repQuery}
                  onChange={(e) => {
                    setRepQuery(e.target.value);
                    setIsRepOpen(true);
                  }}
                  onFocus={() => setIsRepOpen(true)}
                  onBlur={() => setTimeout(() => setIsRepOpen(false), 200)}
                  className="w-full bg-transparent text-sm font-medium text-stone-900 focus:outline-none placeholder:text-stone-400"
                />
              </div>
            )}
          </div>

          {/* Dropdown de Representantes */}
          {isRepOpen && !selectedRepresentative && (
            <div className="absolute left-4 right-4 mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl z-30 overflow-hidden py-1">
              {filteredReps.length > 0 ? (
                filteredReps.map((rep) => (
                  <div
                    key={rep}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (hasItems) {
                        alert('Remova os itens para alterar o representante.');
                        return;
                      }
                      onRepresentativeChange(rep);
                      setRepQuery('');
                      setIsRepOpen(false);
                    }}
                    className="px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-orange-50 hover:text-orange-900 cursor-pointer transition-colors border-b border-stone-50 last:border-none"
                  >
                    {rep}
                  </div>
                ))
              ) : null}

              {isNewRepresentative && (
                <div
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (hasItems) {
                      alert('Remova os itens para alterar o representante.');
                      return;
                    }
                    const newRep = repQuery.trim();
                    onRepresentativeChange(newRep);
                    setRepQuery('');
                    setIsRepOpen(false);
                  }}
                  className="px-4 py-3 text-xs text-orange-900 bg-orange-50/50 cursor-pointer flex items-center gap-2"
                >
                  <span>✨</span>
                  <span>Cadastrar novo representante: <strong>&quot;{repQuery.trim()}&quot;</strong></span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BLOCO DE ADIÇÃO DE PRODUTOS */}
      <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
        Adicionar Produtos
      </span>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200/60 space-y-4">
        {/* Produto */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-stone-600 mb-1">Produto</label>
          <div className="flex flex-wrap items-center gap-2 bg-[#FDFBF7] border border-stone-200 rounded-2xl p-3 shadow-inner min-h-[50px]">
            {selectedProduct ? (
              <div className="inline-flex items-center gap-2 bg-white border border-stone-200 text-stone-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                <span>📦 {selectedProduct}</span>
                <button
                  type="button"
                  onClick={() => { setSelectedProduct(null); setPrice(''); }}
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
                  placeholder={isProductEnabled ? "Digite o nome do novo produto..." : "Informe o representante acima primeiro"}
                  disabled={!isProductEnabled}
                  value={productQuery}
                  onChange={(e) => {
                    setProductQuery(e.target.value);
                    setIsProductOpen(true);
                  }}
                  onFocus={() => setIsProductOpen(true)}
                  onBlur={() => setTimeout(() => setIsProductOpen(false), 200)}
                  className="w-full bg-transparent text-sm font-medium text-stone-900 focus:outline-none placeholder:text-stone-400 disabled:opacity-50"
                />
              </div>
            )}
          </div>

          {/* Dropdown de Produtos */}
          {isProductOpen && !selectedProduct && isProductEnabled && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-stone-200/80 rounded-2xl shadow-2xl z-30 overflow-hidden py-1 divide-y divide-stone-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(([prodName, details]) => (
                  <div
                    key={prodName}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectProduct(prodName)}
                    className="px-4 py-3 text-xs font-medium text-stone-700 hover:bg-orange-50 hover:text-orange-900 cursor-pointer transition-colors flex justify-between items-center"
                  >
                    <span>📦 {prodName}</span>
                    <span className="text-[10px] text-stone-400 font-semibold bg-stone-100 px-2 py-0.5 rounded-full">
                      R$ {details.price}
                    </span>
                  </div>
                ))
              ) : null}

              {productQuery.trim() && (
                <div
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSelectedProduct(productQuery.trim());
                    setProductQuery('');
                    setIsProductOpen(false);
                  }}
                  className="px-4 py-3.5 text-xs text-orange-900 bg-orange-50/50 cursor-pointer flex items-center gap-2"
                >
                  <span>✨</span>
                  <span>Cadastrar novo produto: <strong>&quot;{productQuery}&quot;</strong></span>
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

        {/* Segmentos (Múltiplas Tags + Auto-inclusão se digitado) */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-stone-600 mb-1">Segmentos (Múltiplos)</label>
          <div className="flex flex-wrap items-center gap-2 bg-[#FDFBF7] border border-stone-200 rounded-2xl p-3 shadow-inner min-h-[50px]">
            {selectedSegments.map((seg) => (
              <span key={seg} className="inline-flex items-center gap-1.5 bg-white border border-stone-200 text-stone-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                {seg}
                <button
                  type="button"
                  onClick={() => setSelectedSegments(selectedSegments.filter(s => s !== seg))}
                  className="text-stone-400 hover:text-stone-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={selectedSegments.length === 0 ? "Adicionar segmentos..." : ""}
              value={segmentQuery}
              onChange={(e) => {
                setSegmentQuery(e.target.value);
                setIsSegmentOpen(true);
              }}
              onFocus={() => setIsSegmentOpen(true)}
              onBlur={() => setTimeout(() => setIsSegmentOpen(false), 200)}
              className="bg-transparent text-sm font-medium text-stone-900 focus:outline-none flex-1 min-w-[120px]"
            />
          </div>

          {/* Dropdown de Segmentos */}
          {isSegmentOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-2xl shadow-xl z-20 overflow-hidden py-1">
              {filteredSegments.length > 0 ? (
                filteredSegments.map((seg) => (
                  <div
                    key={seg}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelectedSegments([...selectedSegments, seg]);
                      setSegmentQuery('');
                      setIsSegmentOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-orange-50 hover:text-orange-900 cursor-pointer"
                  >
                    {seg}
                  </div>
                ))
              ) : null}

              {segmentQuery.trim() && !selectedSegments.includes(segmentQuery.trim()) && (
                <div
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSelectedSegments([...selectedSegments, segmentQuery.trim()]);
                    setSegmentQuery('');
                    setIsSegmentOpen(false);
                  }}
                  className="px-4 py-2.5 text-xs text-orange-900 bg-orange-50/50 cursor-pointer"
                >
                  ✨ Adicionar segmento &quot;{segmentQuery.trim()}&quot;
                </div>
              )}
            </div>
          )}
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