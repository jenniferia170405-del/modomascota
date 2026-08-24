import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { X, Pill, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMedicationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedPet, addMedication } = usePetContext();

  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState('Cada 24 horas');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [instructions, setInstructions] = useState('Administrar con la comida');
  const [status, setStatus] = useState<'active' | 'finished'>('active');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !selectedPet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingresa el nombre del medicamento.');
      return;
    }
    if (!dose.trim()) {
      setErrorMsg('Por favor ingresa la dosis.');
      return;
    }

    addMedication({
      pet_id: selectedPet.id,
      name: name.trim(),
      dose: dose.trim(),
      frequency: frequency.trim(),
      start_date: startDate,
      end_date: endDate || undefined,
      instructions: instructions.trim(),
      status,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF9F2] rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-[#EEF5F3]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-[#EEF5F3] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4B183] text-white flex items-center justify-center shadow-sm">
              <Pill className="w-5 h-5 text-[#693b17]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-[#285E5B] leading-none">
                Nuevo Medicamento
              </h2>
              <span className="text-xs text-[#6d7a77]">Tratamiento para {selectedPet.name}</span>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1">
          
          {errorMsg && (
            <div className="p-3 bg-[#F47C7C]/20 border border-[#F47C7C] rounded-2xl text-xs text-[#721A20] font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-4">
            
            {/* Name */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Nombre del Medicamento *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Artrosan 10mg, Amoxicilina, Gotas oftálmicas..."
                className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none font-bold"
                required
              />
            </div>

            {/* Dose & Frequency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Dosis *</label>
                <input
                  type="text"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  placeholder="Ej. 1 comprimido, 5ml, 2 gotas..."
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Frecuencia *</label>
                <input
                  type="text"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder="Ej. Cada 8 horas, Cada 24h con comida..."
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                  required
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Fecha de Inicio *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Fecha de Fin (Opcional)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Estado del Tratamiento</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('active')}
                  className={`py-2.5 rounded-xl font-heading font-bold text-xs transition-all btn-bounce ${
                    status === 'active'
                      ? 'bg-[#4DB6AC] text-white shadow-sm'
                      : 'bg-[#FAF9F2] text-[#374745] border border-[#bdc9c6]/40 hover:bg-[#EEF5F3]'
                  }`}
                >
                  🟢 Activo / En curso
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('finished')}
                  className={`py-2.5 rounded-xl font-heading font-bold text-xs transition-all btn-bounce ${
                    status === 'finished'
                      ? 'bg-[#285E5B] text-white shadow-sm'
                      : 'bg-[#FAF9F2] text-[#374745] border border-[#bdc9c6]/40 hover:bg-[#EEF5F3]'
                  }`}
                >
                  ⚪ Finalizado
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Instrucciones de Administración</label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Ej. Con comida en el desayuno, agitar antes de usar..."
                className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Observaciones</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Motivo del tratamiento, recomendaciones del veterinario..."
                className="w-full min-h-[70px] p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] text-sm focus:border-[#4DB6AC] outline-none resize-none"
              />
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-base shadow-[0_10px_25px_-5px_rgba(77,182,172,0.3)] hover:opacity-90 active:scale-98 transition-all btn-bounce flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Guardar Medicamento</span>
          </button>

        </form>

      </div>
    </div>
  );
};
