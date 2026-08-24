import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { HealthRecordType } from '../types';
import { X, Sparkles, AlertCircle, Syringe, Stethoscope, TestTube, Bug, Pill, Scale } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: HealthRecordType;
}

export const AddHealthRecordModal: React.FC<Props> = ({ isOpen, onClose, defaultType = 'Vacuna' }) => {
  const { selectedPet, addHealthRecord, updatePet } = usePetContext();

  const [type, setType] = useState<HealthRecordType>(defaultType);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextDate, setNextDate] = useState('');
  const [veterinarian, setVeterinarian] = useState('Dr. Pérez');
  const [clinic, setClinic] = useState('VetCare San Isidro');
  const [product, setProduct] = useState('');
  const [dose, setDose] = useState('');
  const [weightValue, setWeightValue] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !selectedPet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && type !== 'Peso') {
      setErrorMsg('Por favor ingresa un título o nombre del procedimiento.');
      return;
    }

    const finalTitle = type === 'Peso' ? `Registro de Peso: ${weightValue}kg` : title.trim();

    addHealthRecord({
      pet_id: selectedPet.id,
      type,
      title: finalTitle,
      date,
      next_date: nextDate || undefined,
      veterinarian: veterinarian.trim() || undefined,
      clinic: clinic.trim() || undefined,
      product: product.trim() || undefined,
      dose: dose.trim() || undefined,
      notes: notes.trim() || undefined,
      weight_value: weightValue !== '' ? Number(weightValue) : undefined,
      completed: true,
    });

    // If type is peso, update pet's weight
    if (type === 'Peso' && weightValue !== '' && Number(weightValue) > 0) {
      updatePet(selectedPet.id, { weight: Number(weightValue) });
    }

    onClose();
  };

  const typesList: { id: HealthRecordType; label: string; icon: string }[] = [
    { id: 'Vacuna', label: 'Vacuna', icon: '💉' },
    { id: 'Consulta', label: 'Consulta', icon: '🩺' },
    { id: 'Examen', label: 'Examen', icon: '🩸' },
    { id: 'Desparasitación', label: 'Desparasitación', icon: '🪱' },
    { id: 'Antipulgas', label: 'Antipulgas', icon: '🦟' },
    { id: 'Medicina', label: 'Medicina', icon: '💊' },
    { id: 'Peso', label: 'Peso', icon: '⚖️' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF9F2] rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-[#EEF5F3]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-[#EEF5F3] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4DB6AC] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-2xl">health_and_safety</span>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-[#285E5B] leading-none">
                Añadir Registro de Salud
              </h2>
              <span className="text-xs text-[#6d7a77]">Historial para {selectedPet.name}</span>
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

          {/* Type Selector Tabs */}
          <div>
            <label className="text-xs font-bold text-[#6d7a77] uppercase tracking-wider block mb-2">
              Tipo de Registro
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {typesList.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`py-2 px-1 rounded-xl text-xs font-heading font-bold flex flex-col items-center gap-1 transition-all btn-bounce ${
                    type === t.id
                      ? 'bg-[#4DB6AC] text-white shadow-sm'
                      : 'bg-white text-[#374745] border border-[#bdc9c6]/40 hover:bg-[#EEF5F3]'
                  }`}
                >
                  <span className="text-base leading-none">{t.icon}</span>
                  <span className="text-[10px] truncate w-full text-center">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-4">
            
            {/* Title / Name */}
            {type !== 'Peso' && (
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">
                  {type === 'Vacuna' ? 'Nombre de la Vacuna *' : type === 'Examen' ? 'Tipo de Examen *' : 'Título o Motivo *'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    type === 'Vacuna' ? 'Ej. Vacuna Antirrábica, Séxtuple...' :
                    type === 'Examen' ? 'Ej. Examen de Sangre, Ecografía...' :
                    type === 'Desparasitación' ? 'Ej. Desparasitación Interna...' :
                    type === 'Antipulgas' ? 'Ej. Aplicación Antipulgas Nexgard...' :
                    'Ej. Consulta General, Limpieza Dental...'
                  }
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                  required
                />
              </div>
            )}

            {/* Weight Value */}
            {type === 'Peso' && (
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Peso Medido (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={`Ej. ${selectedPet.weight || 12.4}`}
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none font-bold"
                  required
                />
              </div>
            )}

            {/* Date & Next Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Fecha de Aplicación / Consulta *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Próxima Fecha (Opcional)</label>
                <input
                  type="date"
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                />
              </div>
            </div>

            {/* Product & Dose for vaccines, deworming, antipulgas */}
            {(type === 'Vacuna' || type === 'Desparasitación' || type === 'Antipulgas' || type === 'Medicina') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#6d7a77] block mb-1">Producto / Marca</label>
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="Ej. Nexgard, Drontal, Nobivac..."
                    className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#6d7a77] block mb-1">Dosis</label>
                  <input
                    type="text"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    placeholder="Ej. 1 tableta, 2.5ml, 1 pipeta..."
                    className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Vet & Clinic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Veterinario</label>
                <input
                  type="text"
                  value={veterinarian}
                  onChange={(e) => setVeterinarian(e.target.value)}
                  placeholder="Dr. Pérez"
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Clínica</label>
                <input
                  type="text"
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  placeholder="VetCare San Isidro"
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Observaciones / Resultados</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. 'Revisión de peso ok', sin reacciones secundarias..."
                className="w-full min-h-[80px] p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] text-sm focus:border-[#4DB6AC] outline-none resize-none"
              />
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-base shadow-[0_10px_25px_-5px_rgba(77,182,172,0.3)] hover:opacity-90 active:scale-98 transition-all btn-bounce flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Guardar en Historial de Salud</span>
          </button>

        </form>

      </div>
    </div>
  );
};
