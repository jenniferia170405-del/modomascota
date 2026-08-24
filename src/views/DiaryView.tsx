import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { AddDiaryModal } from '../components/AddDiaryModal';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Calendar, 
  Tag, 
  Sparkles, 
  Heart,
  Camera
} from 'lucide-react';

export const DiaryView: React.FC = () => {
  const { selectedPet, petDiaryEntries, deleteDiaryEntry } = usePetContext();
  const [isAddDiaryOpen, setIsAddDiaryOpen] = useState(false);

  if (!selectedPet) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl soft-shadow border border-[#EEF5F3]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F47C7C] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-2xl">auto_stories</span>
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#285E5B]">
              Diario de {selectedPet.name}
            </h2>
            <p className="text-xs text-[#6d7a77] mt-0.5">
              Momentos especiales, fotos y anécdotas
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddDiaryOpen(true)}
          className="w-full sm:w-auto py-2.5 px-5 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm btn-bounce hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nueva Entrada</span>
        </button>
      </div>

      {/* Diary Timeline (Matches Image 11.png) */}
      {petDiaryEntries.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-[#EEF5F3] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F2] text-[#4DB6AC] flex items-center justify-center mx-auto mb-3">
            <Camera className="w-8 h-8" />
          </div>
          <h4 className="font-heading font-bold text-lg text-[#285E5B]">
            El diario de {selectedPet.name} está vacío
          </h4>
          <p className="text-xs text-[#6d7a77] mt-1 mb-4 max-w-sm mx-auto">
            Guarda recuerdos inolvidables, fotos en el parque, días de descanso y anécdotas felices.
          </p>
          <button
            onClick={() => setIsAddDiaryOpen(true)}
            className="py-2.5 px-5 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-xs shadow-sm btn-bounce"
          >
            + Guardar Primer Recuerdo
          </button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-8 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#4DB6AC]/40">
          {petDiaryEntries.map((entry) => (
            <div key={entry.id} className="relative group">
              
              {/* Timeline Dot */}
              <div className="absolute -left-6 sm:-left-8 top-5 w-6 h-6 rounded-full bg-[#4DB6AC] text-white border-2 border-white flex items-center justify-center shadow-sm text-xs">
                ✨
              </div>

              {/* Memory Card */}
              <div className="bg-white rounded-[28px] overflow-hidden soft-shadow border border-[#EEF5F3] hover:border-[#4DB6AC]/40 transition-all">
                
                {/* Photo */}
                <div className="relative w-full h-56 sm:h-72 bg-[#FAF9F2] overflow-hidden">
                  <img
                    src={entry.photo}
                    alt={entry.title || 'Aventura'}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  
                  {/* Mood badge top right */}
                  {entry.mood && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-heading font-bold text-[#285E5B] shadow-md flex items-center gap-1.5">
                      <span>{entry.mood === 'Muy feliz' ? '🥰' : entry.mood === 'Relajado' ? '🌸' : '🐾'}</span>
                      <span>{entry.mood}</span>
                    </div>
                  )}

                  {/* Date badge bottom left */}
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#F4B183]" />
                    <span>{entry.date}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    {entry.title && (
                      <h3 className="font-heading font-bold text-xl text-[#285E5B]">
                        {entry.title}
                      </h3>
                    )}
                    <button
                      onClick={() => deleteDiaryEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#ba1a1a] transition-opacity p-1.5 ml-auto"
                      title="Eliminar recuerdo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-[#374745] leading-relaxed">
                    {entry.description}
                  </p>

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {entry.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EEF5F3] text-[#285E5B] flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3 text-[#4DB6AC]" />
                          <span>#{t}</span>
                        </span>
                      ))}
                    </div>
                  )}

                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AddDiaryModal
        isOpen={isAddDiaryOpen}
        onClose={() => setIsAddDiaryOpen(false)}
      />

    </div>
  );
};
