import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { AppetiteLevel, EnergyLevel, MoodLevel } from '../types';
import { X, CheckCircle2, Sparkles, History } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DailyCheckModal: React.FC = () => {
  const { 
    isDailyCheckOpen, 
    setIsDailyCheckOpen, 
    selectedPet, 
    addDailyRecord, 
    petDailyRecords 
  } = usePetContext();

  const [appetite, setAppetite] = useState<AppetiteLevel>('bueno');
  const [energy, setEnergy] = useState<EnergyLevel>('alta');
  const [mood, setMood] = useState<MoodLevel>('feliz');
  const [stoolOk, setStoolOk] = useState(true);
  const [vomiting, setVomiting] = useState(false);
  const [water, setWater] = useState<'normal' | 'bajo' | 'alto'>('normal');
  const [notes, setNotes] = useState('');
  const [lastWalk, setLastWalk] = useState('hace 2 horas');
  const [isSaved, setIsSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  if (!isDailyCheckOpen || !selectedPet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    addDailyRecord({
      pet_id: selectedPet.id,
      date: dateStr,
      time: timeStr,
      appetite,
      energy,
      mood,
      stool_ok: stoolOk,
      vomiting,
      water,
      notes: notes.trim() || undefined,
      lastWalk: lastWalk.trim() || undefined,
    });

    setIsSaved(true);
    
    // Confetti burst
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4DB6AC', '#F4B183', '#285E5B'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSaved(false);
      setIsDailyCheckOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF9F2] rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-[#EEF5F3]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-[#EEF5F3] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#4DB6AC] bg-[#FAF9F2]">
              <img src={selectedPet.photo} alt={selectedPet.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-[#285E5B] leading-none">
                ¿Cómo está {selectedPet.name} hoy?
              </h2>
              <span className="text-xs text-[#6d7a77]">Seguimiento diario de bienestar</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-full transition-colors ${
                showHistory ? 'bg-[#4DB6AC] text-white' : 'bg-[#EEF5F3] text-[#285E5B] hover:bg-[#daece9]'
              }`}
              title="Ver historial de registros"
            >
              <History className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDailyCheckOpen(false)}
              className="p-2 rounded-full bg-[#EEF5F3] text-[#374745] hover:bg-[#daece9] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">

          {showHistory ? (
            /* History Section */
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-bold text-lg text-[#285E5B]">
                  Historial de Estados ({petDailyRecords.length})
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-xs text-[#4DB6AC] font-bold hover:underline"
                >
                  Volver a Registrar
                </button>
              </div>

              {petDailyRecords.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#bdc9c6]">
                  <p className="text-sm text-[#6d7a77]">No hay registros diarios para {selectedPet.name} todavía.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {petDailyRecords.map((rec) => (
                    <div key={rec.id} className="bg-white p-4 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-2">
                      <div className="flex justify-between items-center text-xs text-[#6d7a77] border-b border-[#EEF5F3] pb-2">
                        <span className="font-bold text-[#285E5B]">{rec.date} · {rec.time || 'Registro diario'}</span>
                        <span className="capitalize px-2 py-0.5 rounded-full bg-[#EEF5F3] text-[#285E5B] font-semibold">
                          {rec.mood}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-[#FAF9F2] p-2 rounded-xl text-center">
                          <span className="text-[#6d7a77] block text-[10px]">Apetito</span>
                          <span className="font-bold capitalize text-[#374745]">{rec.appetite}</span>
                        </div>
                        <div className="bg-[#FAF9F2] p-2 rounded-xl text-center">
                          <span className="text-[#6d7a77] block text-[10px]">Energía</span>
                          <span className="font-bold capitalize text-[#374745]">{rec.energy}</span>
                        </div>
                        <div className="bg-[#FAF9F2] p-2 rounded-xl text-center">
                          <span className="text-[#6d7a77] block text-[10px]">Digestión</span>
                          <span className="font-bold text-[#374745]">{rec.stool_ok ? 'Normal' : 'Alterada'}</span>
                        </div>
                      </div>
                      {rec.notes && (
                        <p className="text-xs text-[#374745] bg-[#EEF5F3]/60 p-2.5 rounded-xl italic">
                          "{rec.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Check Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Apetito */}
              <div className="bg-white p-4 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🍖</span>
                  <h3 className="font-heading font-bold text-base text-[#285E5B]">Apetito</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['malo', 'regular', 'bueno'] as AppetiteLevel[]).map((lvl) => {
                    const isSelected = appetite === lvl;
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setAppetite(lvl)}
                        className={`py-2.5 px-3 rounded-full text-xs sm:text-sm font-heading font-bold capitalize transition-all btn-bounce ${
                          isSelected
                            ? 'bg-[#4DB6AC] text-white shadow-md'
                            : 'bg-[#FAF9F2] text-[#374745] border border-[#bdc9c6]/40 hover:bg-[#EEF5F3]'
                        }`}
                      >
                        {lvl === 'malo' ? 'Malo' : lvl === 'regular' ? 'Regular' : 'Bueno'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Energía */}
              <div className="bg-white p-4 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <h3 className="font-heading font-bold text-base text-[#285E5B]">Energía</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['baja', 'media', 'alta'] as EnergyLevel[]).map((lvl) => {
                    const isSelected = energy === lvl;
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setEnergy(lvl)}
                        className={`py-2.5 px-3 rounded-full text-xs sm:text-sm font-heading font-bold capitalize transition-all btn-bounce ${
                          isSelected
                            ? 'bg-[#4DB6AC] text-white shadow-md'
                            : 'bg-[#FAF9F2] text-[#374745] border border-[#bdc9c6]/40 hover:bg-[#EEF5F3]'
                        }`}
                      >
                        {lvl === 'baja' ? 'Baja' : lvl === 'media' ? 'Media' : 'Alta'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ánimo */}
              <div className="bg-white p-4 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">😊</span>
                  <h3 className="font-heading font-bold text-base text-[#285E5B]">Ánimo</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'triste', label: 'Triste', icon: '😢' },
                    { id: 'molesto', label: 'Molesto', icon: '😠' },
                    { id: 'feliz', label: 'Feliz', icon: '🥰' },
                  ].map((m) => {
                    const isSelected = mood === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setMood(m.id as MoodLevel)}
                        className={`py-2.5 px-2 rounded-2xl text-xs sm:text-sm font-heading font-bold flex flex-col items-center gap-1 transition-all btn-bounce ${
                          isSelected
                            ? 'bg-[#4DB6AC] text-white shadow-md'
                            : 'bg-[#FAF9F2] text-[#374745] border border-[#bdc9c6]/40 hover:bg-[#EEF5F3]'
                        }`}
                      >
                        <span className="text-xl">{m.icon}</span>
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Salud (Heces & Vómitos) */}
              <div className="bg-white p-4 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#285E5B] text-xl">health_and_safety</span>
                  <h3 className="font-heading font-bold text-base text-[#285E5B]">Digestión y Salud</h3>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Stool toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💩</span>
                      <span className="text-sm font-bold text-[#374745]">¿Heces Ok / Normales?</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stoolOk}
                        onChange={(e) => setStoolOk(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#bdc9c6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4DB6AC]"></div>
                    </label>
                  </div>

                  <hr className="border-[#EEF5F3]" />

                  {/* Vomiting toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🤮</span>
                      <span className="text-sm font-bold text-[#374745]">¿Presentó Vómitos?</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vomiting}
                        onChange={(e) => setVomiting(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#bdc9c6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F47C7C]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div className="bg-white p-4 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#285E5B] text-xl">notes</span>
                  <h3 className="font-heading font-bold text-base text-[#285E5B]">Observaciones</h3>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observaciones, comportamiento, medicamentos dados hoy..."
                  className="w-full min-h-[90px] p-3 rounded-xl border border-[#bdc9c6]/60 bg-[#FAF9F2] text-sm text-[#374745] focus:border-[#4DB6AC] focus:ring-1 focus:ring-[#4DB6AC] outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaved}
                  className={`w-full py-3.5 px-6 rounded-full font-heading font-bold text-base flex items-center justify-center gap-2 shadow-[0_10px_25px_-5px_rgba(77,182,172,0.3)] transition-all btn-bounce ${
                    isSaved
                      ? 'bg-[#285E5B] text-white'
                      : 'bg-[#4DB6AC] hover:opacity-90 text-white'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>¡Registro Guardado!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Guardar Registro de Hoy</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
