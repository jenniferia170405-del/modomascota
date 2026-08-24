import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { ReminderCategory } from '../types';
import { X, Bell, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: ReminderCategory; label: string; icon: string; bg: string }[] = [
  { id: 'Medicamentos', label: 'Medicamentos', icon: '💊', bg: '#F4B183' },
  { id: 'Vacunas', label: 'Vacunas', icon: '💉', bg: '#F47C7C' },
  { id: 'Desparasitación', label: 'Desparasitación', icon: '🪱', bg: '#4DB6AC' },
  { id: 'Antipulgas', label: 'Antipulgas', icon: '🦟', bg: '#F4B183' },
  { id: 'Veterinario', label: 'Veterinario', icon: '🩺', bg: '#F47C7C' },
  { id: 'Baño', label: 'Baño', icon: '🛁', bg: '#4DB6AC' },
  { id: 'Corte de uñas', label: 'Corte de uñas', icon: '✂️', bg: '#F4B183' },
  { id: 'Alimentación', label: 'Alimentación', icon: '🍖', bg: '#4DB6AC' },
  { id: 'Otros', label: 'Otros', icon: '📝', bg: '#bdc9c6' },
];

export const AddReminderModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedPet, addReminder } = usePetContext();

  const [category, setCategory] = useState<ReminderCategory>('Medicamentos');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00');
  const [recurrence, setRecurrence] = useState<'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !selectedPet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Por favor ingresa un título para el recordatorio.');
      return;
    }

    addReminder({
      pet_id: selectedPet.id,
      category,
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      time,
      recurrence,
      completed: false,
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
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-[#285E5B] leading-none">
                Nuevo Recordatorio
              </h2>
              <span className="text-xs text-[#6d7a77]">Aviso para {selectedPet.name}</span>
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
              Categoría
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-2.5 rounded-2xl text-xs font-heading font-bold flex items-center gap-2 transition-all btn-bounce ${
                    category === cat.id
                      ? 'bg-[#4DB6AC] text-white shadow-md'
                      : 'bg-white text-[#374745] border border-[#bdc9c6]/40 hover:bg-[#EEF5F3]'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-4">
            
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Título de la Tarea *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Medicina (Artrosan), Baño y corte, Refuerzo vacuna..."
                className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none font-bold"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Detalles / Ubicación (Opcional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Con comida, Spa Canino Happy Paws, En ayunas..."
                className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Fecha *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Hora *</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none font-bold"
                  required
                />
              </div>
            </div>

            {/* Recurrence */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Repetición</label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as any)}
                className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none font-semibold"
              >
                <option value="once">Una sola vez</option>
                <option value="daily">Todos los días (Diario)</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="yearly">Anual (Vacunas)</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-base shadow-[0_10px_25px_-5px_rgba(77,182,172,0.3)] hover:opacity-90 active:scale-98 transition-all btn-bounce flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Crear Recordatorio</span>
          </button>

        </form>

      </div>
    </div>
  );
};
