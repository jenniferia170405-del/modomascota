import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { HealthRecordType } from '../types';
import { AddHealthRecordModal } from '../components/AddHealthRecordModal';
import { AddMedicationModal } from '../components/AddMedicationModal';
import { 
  Heart, 
  Plus, 
  Pill, 
  Calendar, 
  Stethoscope, 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  Trash2,
  Syringe,
  Bug,
  TestTube
} from 'lucide-react';

import { WeightChart } from '../components/WeightChart';
import { Utensils } from 'lucide-react';

export const HealthView: React.FC = () => {
  const { 
    selectedPet, 
    petHealthRecords, 
    petMedications, 
    deleteHealthRecord,
    deleteMedication,
    updateMedication,
    setIsFoodCalculatorOpen
  } = usePetContext();

  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [isAddHealthOpen, setIsAddHealthOpen] = useState(false);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [defaultRecordType, setDefaultRecordType] = useState<HealthRecordType>('Vacuna');

  if (!selectedPet) return null;

  const filters = ['Todos', 'Vacunas', 'Consultas', 'Medicinas', 'Desparasitación', 'Antipulgas', 'Exámenes', 'Peso'];

  const filteredRecords = petHealthRecords.filter((rec) => {
    if (selectedFilter === 'Todos') return true;
    if (selectedFilter === 'Vacunas') return rec.type === 'Vacuna';
    if (selectedFilter === 'Consultas') return rec.type === 'Consulta';
    if (selectedFilter === 'Medicinas') return rec.type === 'Medicina';
    if (selectedFilter === 'Desparasitación') return rec.type === 'Desparasitación';
    if (selectedFilter === 'Antipulgas') return rec.type === 'Antipulgas';
    if (selectedFilter === 'Exámenes') return rec.type === 'Examen';
    if (selectedFilter === 'Peso') return rec.type === 'Peso';
    return true;
  });

  const getRecordIcon = (type: HealthRecordType) => {
    switch (type) {
      case 'Vacuna': return { emoji: '💉', bg: 'bg-[#F47C7C]/25 text-[#721a20]' };
      case 'Consulta': return { emoji: '🩺', bg: 'bg-[#4DB6AC]/25 text-[#00433f]' };
      case 'Examen': return { emoji: '🩸', bg: 'bg-[#F4B183]/25 text-[#85522c]' };
      case 'Desparasitación': return { emoji: '🪱', bg: 'bg-[#4DB6AC]/25 text-[#00433f]' };
      case 'Antipulgas': return { emoji: '🦟', bg: 'bg-[#F4B183]/25 text-[#85522c]' };
      case 'Medicina': return { emoji: '💊', bg: 'bg-[#F4B183]/25 text-[#85522c]' };
      case 'Peso': return { emoji: '⚖️', bg: 'bg-[#EEF5F3] text-[#285E5B]' };
      default: return { emoji: '🐾', bg: 'bg-[#EEF5F3] text-[#285E5B]' };
    }
  };

  const handleOpenAddWithType = (type: HealthRecordType) => {
    setDefaultRecordType(type);
    setIsAddHealthOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl soft-shadow border border-[#EEF5F3] dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F47C7C] text-white flex items-center justify-center shadow-md">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#285E5B] dark:text-white">
              Salud de {selectedPet.name}
            </h2>
            <p className="text-xs text-[#6d7a77] dark:text-slate-400 mt-0.5">
              Vacunas, consultas, antipulgas y medicación
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsFoodCalculatorOpen(true)}
            className="py-2.5 px-4 rounded-full bg-teal-50 dark:bg-slate-700 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-slate-600 font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 btn-bounce"
          >
            <Utensils className="w-4 h-4" />
            <span>Calculadora Comida</span>
          </button>

          <button
            onClick={() => handleOpenAddWithType('Vacuna')}
            className="flex-1 sm:flex-none py-2.5 px-4 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm btn-bounce hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            <span>+ Añadir Registro</span>
          </button>
        </div>
      </div>

      {/* Weight History Chart Component */}
      <WeightChart records={petHealthRecords} currentWeight={selectedPet.weight} />


      {/* Active Medications Bento Section */}
      <div className="bg-white p-6 rounded-3xl soft-shadow border border-[#EEF5F3] space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F4B183]/30 text-[#693b17] flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#285E5B]">
              Tratamientos & Medicamentos Activos
            </h3>
          </div>
          <button
            onClick={() => setIsAddMedOpen(true)}
            className="text-xs font-bold text-[#4DB6AC] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Tratamiento</span>
          </button>
        </div>

        {petMedications.length === 0 ? (
          <p className="text-xs text-[#6d7a77] bg-[#FAF9F2] p-4 rounded-2xl border border-dashed border-[#bdc9c6]">
            No hay tratamientos ni medicamentos registrados actualmente para {selectedPet.name}.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {petMedications.map((med) => {
              const isActive = med.status === 'active';
              return (
                <div 
                  key={med.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive 
                      ? 'bg-[#FAF9F2] border-[#4DB6AC]/40 shadow-sm' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💊</span>
                        <h4 className="font-heading font-bold text-base text-[#374745]">{med.name}</h4>
                      </div>
                      <span className="text-xs text-[#4DB6AC] font-bold mt-0.5 block">
                        Dosis: {med.dose} · {med.frequency}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateMedication(med.id, { status: isActive ? 'finished' : 'active' })}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                          isActive ? 'bg-[#4DB6AC] text-white' : 'bg-gray-300 text-gray-700'
                        }`}
                        title="Cambiar estado"
                      >
                        {isActive ? 'Activo' : 'Finalizado'}
                      </button>
                      <button
                        onClick={() => deleteMedication(med.id)}
                        className="p-1 text-gray-400 hover:text-[#ba1a1a]"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {med.instructions && (
                    <p className="text-xs text-[#6d7a77] mt-2 italic bg-white p-2 rounded-xl border border-[#EEF5F3]">
                      "{med.instructions}"
                    </p>
                  )}

                  <div className="flex justify-between items-center text-[11px] text-[#6d7a77] mt-3 pt-2 border-t border-[#EEF5F3]">
                    <span>Desde: {med.start_date}</span>
                    {med.end_date && <span>Hasta: {med.end_date}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter Chips (Matches Image 5.png) */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {filters.map((f) => {
          const isSelected = selectedFilter === f;
          return (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`py-2 px-4 rounded-full text-xs font-heading font-bold flex-shrink-0 transition-all btn-bounce ${
                isSelected
                  ? 'bg-[#4DB6AC] text-white shadow-md'
                  : 'bg-white text-[#374745] border border-[#bdc9c6]/40 hover:bg-[#EEF5F3]'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Timeline of Health Records (Matches Image 5.png) */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#EEF5F3] shadow-sm">
            <span className="text-4xl mb-3 block">🩺</span>
            <h4 className="font-heading font-bold text-lg text-[#285E5B]">
              No hay registros en "{selectedFilter}"
            </h4>
            <p className="text-xs text-[#6d7a77] mt-1 mb-4">
              Agrega una vacuna, control veterinario o tratamiento para mantener al día su cartilla.
            </p>
            <button
              onClick={() => handleOpenAddWithType('Vacuna')}
              className="py-2.5 px-5 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-xs shadow-sm btn-bounce"
            >
              + Agregar Registro
            </button>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#4DB6AC]/40">
            {filteredRecords.map((rec) => {
              const iconStyle = getRecordIcon(rec.type);
              return (
                <div key={rec.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 sm:-left-8 top-4 w-7 h-7 rounded-full bg-[#4DB6AC] text-white border-2 border-white flex items-center justify-center shadow-sm text-xs">
                    {iconStyle.emoji}
                  </div>

                  {/* Card content */}
                  <div className="bg-white rounded-2xl p-5 soft-shadow border border-[#EEF5F3] hover:border-[#4DB6AC]/40 transition-all">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${iconStyle.bg}`}>
                            {rec.type}
                          </span>
                          <span className="text-xs font-bold text-[#6d7a77]">
                            📅 {rec.date}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-lg text-[#285E5B] mt-1">
                          {rec.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => deleteHealthRecord(rec.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#ba1a1a] transition-opacity p-1"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Meta details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#374745] mt-3 pt-3 border-t border-[#EEF5F3]">
                      {rec.product && (
                        <div>
                          <span className="text-[#6d7a77]">Producto:</span>{' '}
                          <strong className="text-[#285E5B]">{rec.product}</strong>
                          {rec.dose && <span> ({rec.dose})</span>}
                        </div>
                      )}
                      {rec.veterinarian && (
                        <div>
                          <span className="text-[#6d7a77]">Veterinario:</span>{' '}
                          <strong>{rec.veterinarian}</strong>
                          {rec.clinic && <span className="text-[#6d7a77]"> · {rec.clinic}</span>}
                        </div>
                      )}
                      {rec.weight_value && (
                        <div>
                          <span className="text-[#6d7a77]">Peso Registrado:</span>{' '}
                          <strong className="text-[#285E5B]">{rec.weight_value} kg</strong>
                        </div>
                      )}
                      {rec.next_date && (
                        <div className="text-[#F47C7C] font-bold">
                          🔔 Próxima dosis: {rec.next_date}
                        </div>
                      )}
                    </div>

                    {rec.notes && (
                      <p className="text-xs text-[#6d7a77] mt-2.5 bg-[#FAF9F2] p-2.5 rounded-xl italic">
                        "{rec.notes}"
                      </p>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modals */}
      <AddHealthRecordModal
        isOpen={isAddHealthOpen}
        onClose={() => setIsAddHealthOpen(false)}
        defaultType={defaultRecordType}
      />

      <AddMedicationModal
        isOpen={isAddMedOpen}
        onClose={() => setIsAddMedOpen(false)}
      />

    </div>
  );
};
