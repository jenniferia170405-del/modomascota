import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { ExpenseCategory } from '../types';
import { X, DollarSign, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EXPENSE_CATEGORIES: { id: ExpenseCategory; label: string; icon: string; bg: string }[] = [
  { id: 'Alimento', label: 'Alimento', icon: '🍖', bg: '#F4B183' },
  { id: 'Veterinario', label: 'Veterinario', icon: '🩺', bg: '#F47C7C' },
  { id: 'Higiene', label: 'Higiene', icon: '🧼', bg: '#4DB6AC' },
  { id: 'Medicamentos', label: 'Medicamentos', icon: '💊', bg: '#F4B183' },
  { id: 'Juguetes', label: 'Juguetes', icon: '🧸', bg: '#4DB6AC' },
  { id: 'Accesorios', label: 'Accesorios', icon: '🐾', bg: '#F4B183' },
  { id: 'Otros', label: 'Otros', icon: '💰', bg: '#bdc9c6' },
];

export const AddExpenseModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedPet, addExpense } = usePetContext();

  const [category, setCategory] = useState<ExpenseCategory>('Alimento');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !selectedPet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Por favor ingresa el concepto o descripción del gasto.');
      return;
    }
    if (amount === '' || Number(amount) <= 0) {
      setErrorMsg('Por favor ingresa un monto válido en Soles (S/).');
      return;
    }

    addExpense({
      pet_id: selectedPet.id,
      category,
      description: description.trim(),
      amount: Number(amount),
      date,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF9F2] rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-[#EEF5F3]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-[#EEF5F3] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4DB6AC] text-white flex items-center justify-center shadow-sm">
              <span className="font-heading font-bold text-lg">S/</span>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-[#285E5B] leading-none">
                Añadir Gasto
              </h2>
              <span className="text-xs text-[#6d7a77]">Registrar gasto para {selectedPet.name}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#EEF5F3] text-[#374745] hover:bg-[#daece9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          
          {errorMsg && (
            <div className="p-3 bg-[#F47C7C]/20 border border-[#F47C7C] rounded-2xl text-xs text-[#721A20] font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Category Chips */}
          <div>
            <label className="text-xs font-bold text-[#6d7a77] uppercase tracking-wider block mb-2">
              Categoría del Gasto
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {EXPENSE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-2.5 rounded-2xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all btn-bounce ${
                    category === cat.id
                      ? 'bg-[#4DB6AC] text-white shadow-md'
                      : 'bg-white text-[#374745] border border-[#bdc9c6]/40 hover:bg-[#EEF5F3]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate text-[11px]">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-4">
            
            {/* Amount */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Monto (en Soles S/) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading font-bold text-lg text-[#285E5B]">
                  S/
                </span>
                <input
                  type="number"
                  step="0.50"
                  min="0.50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full text-lg p-3 pl-12 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none font-bold text-[#285E5B]"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Concepto / Detalle *</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Bolsa de ProPlan 15kg, Consulta veterinaria, Pipeta..."
                className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Fecha del Gasto *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-base shadow-[0_10px_25px_-5px_rgba(77,182,172,0.3)] hover:opacity-90 active:scale-98 transition-all btn-bounce flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Registrar Gasto</span>
          </button>

        </form>

      </div>
    </div>
  );
};
