import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { 
  Heart, 
  Pill, 
  Calendar, 
  Utensils, 
  DollarSign, 
  Camera, 
  Check, 
  Clock, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  ChevronRight,
  History
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HomeView: React.FC = () => {
  const { 
    selectedPet, 
    setCurrentView, 
    setIsDailyCheckOpen, 
    petReminders, 
    toggleReminder, 
    latestDailyRecord,
    petMedications,
    pets,
    setIsAddPetOpen
  } = usePetContext();

  const [activeTaskFilter, setActiveTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  if (!selectedPet) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto bg-white rounded-3xl shadow-sm border border-[#EEF5F3] my-12">
        <div className="w-16 h-16 rounded-full bg-[#4DB6AC]/20 text-[#285E5B] flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">pets</span>
        </div>
        <h2 className="font-heading font-bold text-2xl text-[#285E5B] mb-2">
          Todavía no tienes mascotas registradas 🐾
        </h2>
        <p className="text-sm text-[#6d7a77] mb-6">
          Agrega a tu primer compañero para comenzar a gestionar su salud, recordatorios y momentos especiales.
        </p>
        <button
          onClick={() => setIsAddPetOpen(true)}
          className="py-3.5 px-6 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-sm shadow-md btn-bounce"
        >
          + Agregar Mascota
        </button>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayReminders = petReminders.filter(r => r.date === todayStr || r.recurrence === 'daily');

  const pendingReminders = todayReminders.filter(r => !r.completed);
  const completedReminders = todayReminders.filter(r => r.completed);

  const handleToggleTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleReminder(id);
    
    // Quick celebratory confetti if completing
    const item = petReminders.find(r => r.id === id);
    if (item && !item.completed) {
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#4DB6AC', '#F4B183', '#285E5B'],
        });
      } catch {
        // ignore
      }
    }
  };

  const getReminderEmoji = (category: string) => {
    switch (category) {
      case 'Medicamentos': return '💊';
      case 'Vacunas': return '💉';
      case 'Desparasitación': return '🪱';
      case 'Antipulgas': return '🦟';
      case 'Veterinario': return '🩺';
      case 'Baño': return '🛁';
      case 'Corte de uñas': return '✂️';
      case 'Alimentación': return '🍖';
      default: return '📝';
    }
  };

  const getReminderColor = (category: string) => {
    switch (category) {
      case 'Medicamentos': return 'bg-[#F4B183]/30 text-[#85522c]';
      case 'Vacunas': return 'bg-[#F47C7C]/30 text-[#721a20]';
      case 'Desparasitación': return 'bg-[#F4B183]/30 text-[#85522c]';
      case 'Baño': return 'bg-[#4DB6AC]/30 text-[#00433f]';
      case 'Alimentación': return 'bg-[#F47C7C]/30 text-[#721a20]';
      default: return 'bg-[#EEF5F3] text-[#285E5B]';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">

      {/* Hero Pet Card (Matches Image 1.png & Image 3.png) */}
      <section className="relative bg-white rounded-[28px] sm:rounded-[32px] soft-shadow overflow-hidden group border border-[#EEF5F3]">
        {/* Decorative ambient gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4DB6AC]/15 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F4B183]/15 rounded-full mix-blend-multiply filter blur-2xl opacity-60 translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center p-6 sm:p-8 gap-6 relative z-10">
          
          {/* Pet Circular Avatar with Status Dot */}
          <div 
            onClick={() => setCurrentView('profile')}
            className="w-32 h-32 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white shadow-[0_10px_25px_-5px_rgba(79,209,197,0.3)] flex-shrink-0 relative cursor-pointer group-hover:scale-[1.02] transition-transform"
          >
            <img 
              src={selectedPet.photo} 
              alt={selectedPet.name} 
              className="w-full h-full object-cover"
            />
            {/* Status Indicator */}
            <div className="absolute bottom-2 right-2 w-7 h-7 bg-[#4DB6AC] rounded-full border-2 border-white flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-white font-bold" />
            </div>
          </div>

          {/* Info & Daily Check Trigger */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-grow">
            <div className="flex items-center gap-2 mb-1 flex-wrap justify-center sm:justify-start">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#285E5B] tracking-tight">
                {selectedPet.name}
              </h2>
              <span className="bg-[#F4B183] text-[#374745] font-heading font-bold text-xs px-3 py-1 rounded-full">
                {selectedPet.breed}
              </span>
              <span className="bg-[#EEF5F3] text-[#285E5B] font-heading font-bold text-xs px-2.5 py-1 rounded-full">
                {selectedPet.approximate_age}
              </span>
            </div>

            {/* "¿Cómo está hoy?" Interactive trigger */}
            <button
              onClick={() => setIsDailyCheckOpen(true)}
              className="group/btn flex items-center gap-2 mt-2 mb-3 text-xl sm:text-2xl font-heading font-bold text-[#374745] hover:text-[#4DB6AC] transition-colors"
            >
              <span>¿Cómo está hoy?</span>
              <Sparkles className="w-5 h-5 text-[#4DB6AC] group-hover/btn:rotate-12 transition-transform" />
            </button>

            {/* Status Pill */}
            <div 
              onClick={() => setIsDailyCheckOpen(true)}
              className="flex items-center gap-2 text-[#6d7a77] bg-[#EEF5F3] hover:bg-[#daece9] px-4 py-2 rounded-full cursor-pointer transition-colors"
            >
              <Clock className="w-4 h-4 text-[#4DB6AC]" />
              <span className="text-xs sm:text-sm font-semibold text-[#285E5B]">
                {latestDailyRecord?.last_walk ? `Último paseo: ${latestDailyRecord.last_walk}` : 'Registrar estado del día'}
              </span>
              <span className="text-xs text-[#4DB6AC] font-bold">· Editar</span>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Actions Bento Grid (Matches Image 1.png) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-heading font-bold text-xl text-[#285E5B]">
            Acciones Rápidas
          </h3>
          <span className="text-xs text-[#6d7a77]">Accesos directos de cuidado</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
          
          {/* Card 1: Salud */}
          <button
            onClick={() => setCurrentView('health')}
            className="bg-white rounded-[24px] p-5 flex flex-col items-center justify-center gap-3 soft-shadow hover:-translate-y-1 transition-all btn-bounce border border-[#EEF5F3] h-32 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#F47C7C] text-white flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-sm">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <span className="font-heading font-bold text-sm text-[#374745] group-hover:text-[#285E5B]">
              Salud
            </span>
          </button>

          {/* Card 2: Medicación */}
          <button
            onClick={() => setCurrentView('health')}
            className="bg-white rounded-[24px] p-5 flex flex-col items-center justify-center gap-3 soft-shadow hover:-translate-y-1 transition-all btn-bounce border border-[#EEF5F3] h-32 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#F4B183] text-[#693b17] flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-sm">
              <Pill className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-sm text-[#374745] group-hover:text-[#285E5B]">
              Medicación
            </span>
          </button>

          {/* Card 3: Recordatorios */}
          <button
            onClick={() => setCurrentView('reminders')}
            className="bg-white rounded-[24px] p-5 flex flex-col items-center justify-center gap-3 soft-shadow hover:-translate-y-1 transition-all btn-bounce border border-[#EEF5F3] h-32 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#4DB6AC] text-white flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-sm text-[#374745] group-hover:text-[#285E5B]">
              Recordatorios
            </span>
          </button>

          {/* Card 4: Alimentación / Bienestar */}
          <button
            onClick={() => setIsDailyCheckOpen(true)}
            className="bg-white rounded-[24px] p-5 flex flex-col items-center justify-center gap-3 soft-shadow hover:-translate-y-1 transition-all btn-bounce border border-[#EEF5F3] h-32 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#EEF5F3] text-[#285E5B] flex items-center justify-center group-hover:bg-[#daece9] group-hover:scale-110 transition-all shadow-sm text-2xl">
              🍖
            </div>
            <span className="font-heading font-bold text-sm text-[#374745] group-hover:text-[#285E5B]">
              Alimentación
            </span>
          </button>

          {/* Card 5: Gastos */}
          <button
            onClick={() => setCurrentView('expenses')}
            className="bg-white rounded-[24px] p-5 flex flex-col items-center justify-center gap-3 soft-shadow hover:-translate-y-1 transition-all btn-bounce border border-[#EEF5F3] h-32 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#EEF5F3] text-[#285E5B] flex items-center justify-center group-hover:bg-[#daece9] group-hover:scale-110 transition-all shadow-sm text-2xl">
              💰
            </div>
            <span className="font-heading font-bold text-sm text-[#374745] group-hover:text-[#285E5B]">
              Gastos (S/)
            </span>
          </button>

          {/* Card 6: Diario */}
          <button
            onClick={() => setCurrentView('diary')}
            className="bg-white rounded-[24px] p-5 flex flex-col items-center justify-center gap-3 soft-shadow hover:-translate-y-1 transition-all btn-bounce border border-[#EEF5F3] h-32 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#F47C7C] text-white flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-sm">
              <Camera className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-sm text-[#374745] group-hover:text-[#285E5B]">
              Diario
            </span>
          </button>

        </div>
      </section>

      {/* Today's Alert & Progress Celebration Banner */}
      <section className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white rounded-[28px] p-6 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" /> Alertas & Cuidado Diario
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">
                {pendingReminders.length === 0 && todayReminders.length > 0
                  ? `🎉 ¡Todo completado hoy para ${selectedPet.name}!`
                  : `Tareas de Hoy (${completedReminders.length}/${todayReminders.length || 1})`}
              </h3>
            </div>

            <button
              onClick={() => {
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ['#4DB6AC', '#F4B183', '#FFD700', '#285E5B']
                });
              }}
              className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold backdrop-blur-xs flex items-center gap-1 transition-all"
              title="¡Lanzar confeti de celebración!"
            >
              🎉 Celebrar
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/20 rounded-full h-3.5 p-0.5 border border-white/20">
            <div 
              className="bg-yellow-300 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${todayReminders.length > 0 ? Math.round((completedReminders.length / todayReminders.length) * 100) : 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-emerald-100 font-medium pt-1">
            <span>{todayReminders.length === 0 ? 'Sin tareas agendadas hoy' : `${pendingReminders.length} pendientes`}</span>
            <span className="font-bold text-yellow-200">
              {todayReminders.length > 0 ? `${Math.round((completedReminders.length / todayReminders.length) * 100)}% Completado` : '100% al día'}
            </span>
          </div>
        </div>
      </section>

      {/* Pendiente para hoy (Matches Image 1.png) */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <div>
            <h3 className="font-heading font-bold text-xl text-[#285E5B] dark:text-white">
              Pendiente para hoy
            </h3>
            <span className="text-xs text-[#6d7a77] dark:text-slate-400">
              {pendingReminders.length} tareas pendientes para {selectedPet.name}
            </span>
          </div>
          <button
            onClick={() => setCurrentView('reminders')}
            className="text-[#4DB6AC] font-heading font-bold text-sm hover:underline flex items-center gap-0.5"
          >
            <span>Ver todo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {todayReminders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border border-[#EEF5F3] dark:border-slate-700 shadow-sm">
            <span className="text-3xl mb-2 block">✨</span>
            <p className="font-heading font-bold text-[#285E5B] dark:text-white text-base">¡Todo al día por hoy!</p>
            <p className="text-xs text-[#6d7a77] dark:text-slate-400 mt-1">No hay tareas pendientes registradas para hoy.</p>
          </div>
        ) : (

          <div className="space-y-3">
            {todayReminders.map((rem) => {
              const isCompleted = rem.completed;
              return (
                <div
                  key={rem.id}
                  onClick={(e) => handleToggleTask(rem.id, e)}
                  className={`bg-white rounded-2xl p-4 flex items-center justify-between soft-shadow border border-[#EEF5F3] hover:bg-[#FAF9F2] transition-all cursor-pointer group ${
                    isCompleted ? 'opacity-60 bg-[#EEF5F3]/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm flex-shrink-0 ${getReminderColor(rem.category)}`}>
                      {getReminderEmoji(rem.category)}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-heading font-bold text-base text-[#374745] truncate ${isCompleted ? 'line-through text-[#6d7a77]' : ''}`}>
                        {rem.title}
                      </h4>
                      <p className="text-xs text-[#6d7a77] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-[#4DB6AC]" />
                        <span>{rem.time || '10:00 AM'}</span>
                        {rem.description && (
                          <span className="truncate max-w-[160px] sm:max-w-xs text-[#6d7a77]">· {rem.description}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleToggleTask(rem.id, e)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all btn-bounce flex-shrink-0 ${
                      isCompleted
                        ? 'bg-[#4DB6AC] border-[#4DB6AC] text-white shadow-sm'
                        : 'border-[#bdc9c6] text-transparent hover:border-[#4DB6AC] hover:text-[#4DB6AC]'
                    }`}
                  >
                    <Check className="w-4 h-4 font-bold" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
