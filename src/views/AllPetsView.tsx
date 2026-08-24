import React from 'react';
import { usePetContext } from '../context/PetContext';
import { Plus, Check, Edit3, Heart, Calendar, BookOpen, Sparkles, ChevronRight, DollarSign } from 'lucide-react';

export const AllPetsView: React.FC = () => {
  const { 
    pets, 
    selectedPetId, 
    setSelectedPetId, 
    setIsAddPetOpen, 
    setEditingPet, 
    setCurrentView,
    healthRecords,
    reminders,
    diaryEntries,
    expenses
  } = usePetContext();

  const getSpeciesEmoji = (species: string) => {
    switch (species) {
      case 'Perro': return '🐶';
      case 'Gato': return '🐱';
      case 'Conejo': return '🐰';
      case 'Ave': return '🦜';
      default: return '🐾';
    }
  };

  const handleSelectPet = (petId: string) => {
    setSelectedPetId(petId);
    setCurrentView('home');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl soft-shadow border border-[#EEF5F3]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#4DB6AC] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-2xl">pets</span>
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#285E5B]">
              Mis Mascotas ({pets.length})
            </h2>
            <p className="text-xs text-[#6d7a77] mt-0.5">
              Cuidado personalizado e independiente para cada compañero
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingPet(null);
            setIsAddPetOpen(true);
          }}
          className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-md btn-bounce hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          <span>+ Agregar Mascota</span>
        </button>
      </div>

      {/* Grid of Pets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pets.map((pet) => {
          const isSelected = pet.id === selectedPetId;
          const petHealthCount = healthRecords.filter(r => r.pet_id === pet.id).length;
          const petRemindersCount = reminders.filter(r => r.pet_id === pet.id && !r.completed).length;
          const petDiaryCount = diaryEntries.filter(d => d.pet_id === pet.id).length;
          const petExpenseTotal = expenses.filter(e => e.pet_id === pet.id).reduce((acc, curr) => acc + curr.amount, 0);

          return (
            <div
              key={pet.id}
              className={`bg-white rounded-[28px] p-5 sm:p-6 soft-shadow border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-2 border-[#4DB6AC] shadow-[0_8px_30px_-5px_rgba(77,182,172,0.25)]'
                  : 'border-[#EEF5F3] hover:border-[#4DB6AC]/40'
              }`}
            >
              {/* Active Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 bg-[#4DB6AC] text-white text-[11px] font-heading font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                  <span>Activa Ahora</span>
                </div>
              )}

              <div>
                {/* Pet Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#4DB6AC] bg-[#FAF9F2] flex-shrink-0 shadow-sm">
                    <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 right-0 text-sm bg-white rounded-full p-0.5 shadow">
                      {getSpeciesEmoji(pet.species)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-2xl text-[#285E5B] truncate">
                        {pet.name}
                      </h3>
                      <span className="text-xs bg-[#F4B183] text-[#374745] font-bold px-2 py-0.5 rounded-full">
                        {pet.breed}
                      </span>
                    </div>

                    <p className="text-xs text-[#6d7a77] mt-1">
                      {pet.species} · {pet.sex} · {pet.approximate_age} · <strong>{pet.weight} kg</strong>
                    </p>
                  </div>
                </div>

                {/* Pet Stats Pill Grid */}
                <div className="grid grid-cols-3 gap-2 text-center my-4">
                  <div className="bg-[#FAF9F2] p-2.5 rounded-xl border border-[#EEF5F3]">
                    <span className="text-[10px] font-bold uppercase text-[#6d7a77] block">Salud</span>
                    <span className="font-heading font-bold text-sm text-[#285E5B]">
                      {petHealthCount} registros
                    </span>
                  </div>

                  <div className="bg-[#FAF9F2] p-2.5 rounded-xl border border-[#EEF5F3]">
                    <span className="text-[10px] font-bold uppercase text-[#6d7a77] block">Pendientes</span>
                    <span className="font-heading font-bold text-sm text-[#F47C7C]">
                      {petRemindersCount} avisos
                    </span>
                  </div>

                  <div className="bg-[#FAF9F2] p-2.5 rounded-xl border border-[#EEF5F3]">
                    <span className="text-[10px] font-bold uppercase text-[#6d7a77] block">Gastos (S/)</span>
                    <span className="font-heading font-bold text-sm text-[#285E5B]">
                      S/ {petExpenseTotal.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Important alert if present */}
                {pet.important_alert && (
                  <p className="text-[11px] text-[#721A20] bg-[#F47C7C]/15 border border-[#F47C7C]/30 p-2 rounded-xl font-semibold mb-4">
                    ⚠️ {pet.important_alert}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-[#EEF5F3]">
                <button
                  onClick={() => handleSelectPet(pet.id)}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-all btn-bounce ${
                    isSelected
                      ? 'bg-[#285E5B] text-white shadow-sm'
                      : 'bg-[#4DB6AC] text-white hover:opacity-90'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Ver Panel de Control' : 'Seleccionar Mascota'}</span>
                </button>

                <button
                  onClick={() => {
                    setEditingPet(pet);
                    setIsAddPetOpen(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#EEF5F3] text-[#285E5B] hover:bg-[#daece9] font-heading font-bold text-xs transition-colors"
                  title="Editar perfil"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Multi-Pet Isolation Guarantee Info */}
      <div className="bg-[#FAF9F2] p-5 rounded-3xl border border-[#EEF5F3] flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-full bg-[#4DB6AC]/20 text-[#285E5B] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs text-[#374745] space-y-1">
          <strong className="text-[#285E5B] block font-heading font-bold text-sm">
            Gestión Independiente Multi-Mascota
          </strong>
          <p className="text-[#6d7a77] leading-relaxed">
            Cada mascota posee su propia cartilla médica de vacunas, historial de desparasitaciones, recordatorios de medicamentos, álbum de fotos de aventuras y control de gastos en Soles (S/). La información nunca se mezcla.
          </p>
        </div>
      </div>

    </div>
  );
};
