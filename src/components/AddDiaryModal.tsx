import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { X, Camera, Sparkles, AlertCircle, Plus, Tag } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DIARY_PRESETS = [
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513360309081-38f076278fef?auto=format&fit=crop&w=800&q=80',
];

export const AddDiaryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedPet, addDiaryEntry } = usePetContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(DIARY_PRESETS[0]);
  const [mood, setMood] = useState('Muy feliz');
  const [tagsInput, setTagsInput] = useState('Parque, Ejercicio');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !selectedPet) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Por favor escribe una descripción para el recuerdo.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    addDiaryEntry({
      pet_id: selectedPet.id,
      date,
      photo: photo || selectedPet.photo,
      title: title.trim() || 'Aventura del día',
      description: description.trim(),
      mood,
      tags,
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
              <span className="material-symbols-outlined text-2xl">auto_stories</span>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-[#285E5B] leading-none">
                Nueva Entrada al Diario
              </h2>
              <span className="text-xs text-[#6d7a77]">Guardar recuerdo de {selectedPet.name}</span>
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

          {/* Photo Preview & Upload */}
          <div className="bg-white p-4 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-3">
            <label className="text-xs font-bold text-[#6d7a77] uppercase tracking-wider block">
              Fotografía de la aventura
            </label>

            <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#FAF9F2] border-2 border-dashed border-[#bdc9c6] group">
              <img src={photo} alt="Preview" className="w-full h-full object-cover" />
              <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 mb-1" />
                <span className="text-xs font-bold">Subir foto desde dispositivo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Quick Preset Selector */}
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {DIARY_PRESETS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhoto(url)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    photo === url ? 'border-[#4DB6AC] scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-4">
            
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Título del momento (Opcional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Tarde de parque y juegos, Siesta profunda..."
                className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">¿Qué hicieron hoy? *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Hoy estuvo jugando toda la tarde con su pelota favorita 🐾..."
                className="w-full min-h-[90px] p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] text-sm focus:border-[#4DB6AC] outline-none resize-none"
                required
              />
            </div>

            {/* Mood selector */}
            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Estado de Ánimo</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Muy feliz', icon: '🥰' },
                  { label: 'Relajado', icon: '🌸' },
                  { label: 'Juguetón', icon: '🐾' },
                ].map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setMood(m.label)}
                    className={`py-2 px-2 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all btn-bounce ${
                      mood === m.label
                        ? 'bg-[#4DB6AC] text-white shadow-sm'
                        : 'bg-[#FAF9F2] text-[#374745] border border-[#bdc9c6]/40 hover:bg-[#EEF5F3]'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Etiquetas (separadas por coma)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Parque, Ejercicio, Playa..."
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                />
              </div>

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
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-base shadow-[0_10px_25px_-5px_rgba(77,182,172,0.3)] hover:opacity-90 active:scale-98 transition-all btn-bounce flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Publicar en el Diario</span>
          </button>

        </form>

      </div>
    </div>
  );
};
