import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { AddReminderModal } from '../components/AddReminderModal';
import { 
  Bell, 
  Plus, 
  Check, 
  Clock, 
  Calendar, 
  Sparkles, 
  Trash2, 
  Lightbulb, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RemindersView: React.FC = () => {
  const { 
    selectedPet, 
    petReminders, 
    toggleReminder, 
    deleteReminder 
  } = usePetContext();

  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed'>('today');
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);

  if (!selectedPet) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const todayItems = petReminders.filter(
    (r) => (r.date === todayStr || r.recurrence === 'daily') && !r.completed
  );

  const upcomingItems = petReminders.filter(
    (r) => r.date > todayStr && !r.completed && r.recurrence !== 'daily'
  );

  const completedItems = petReminders.filter((r) => r.completed);

  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleReminder(id);

    const item = petReminders.find((r) => r.id === id);
    if (item && !item.completed) {
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#4DB6AC', '#F4B183', '#285E5B'],
        });
      } catch {
        // ignore
      }
    }
  };

  const getCategoryDetails = (cat: string) => {
    switch (cat) {
      case 'Medicamentos': return { emoji: '💊', bg: 'bg-[#F4B183]/30 text-[#85522c]' };
      case 'Vacunas': return { emoji: '💉', bg: 'bg-[#F47C7C]/30 text-[#721a20]' };
      case 'Desparasitación': return { emoji: '🪱', bg: 'bg-[#4DB6AC]/30 text-[#00433f]' };
      case 'Antipulgas': return { emoji: '🦟', bg: 'bg-[#F4B183]/30 text-[#85522c]' };
      case 'Veterinario': return { emoji: '🩺', bg: 'bg-[#F47C7C]/30 text-[#721a20]' };
      case 'Baño': return { emoji: '🛁', bg: 'bg-[#4DB6AC]/30 text-[#00433f]' };
      case 'Corte de uñas': return { emoji: '✂️', bg: 'bg-[#F4B183]/30 text-[#85522c]' };
      case 'Alimentación': return { emoji: '🍖', bg: 'bg-[#4DB6AC]/30 text-[#00433f]' };
      default: return { emoji: '📝', bg: 'bg-[#EEF5F3] text-[#285E5B]' };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl soft-shadow border border-[#EEF5F3]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#4DB6AC] text-white flex items-center justify-center shadow-md">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#285E5B]">
              Recordatorios de {selectedPet.name}
            </h2>
            <p className="text-xs text-[#6d7a77] mt-0.5">
              Medicamentos, citas y cuidados diarios
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddReminderOpen(true)}
          className="w-full sm:w-auto py-2.5 px-5 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm btn-bounce hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Recordatorio</span>
        </button>
      </div>

      {/* Tabs (Matches Image 7.png) */}
      <div className="flex bg-white p-1.5 rounded-2xl soft-shadow border border-[#EEF5F3]">
        {[
          { id: 'today', label: 'Hoy', count: todayItems.length },
          { id: 'upcoming', label: 'Próximos', count: upcomingItems.length },
          { id: 'completed', label: 'Completados', count: completedItems.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all btn-bounce flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-[#4DB6AC] text-white shadow-sm'
                  : 'text-[#6d7a77] hover:text-[#285E5B]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                isActive ? 'bg-white/25 text-white' : 'bg-[#EEF5F3] text-[#285E5B]'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List content according to selected tab */}
      <div className="space-y-3">
        {activeTab === 'today' && (
          <>
            {todayItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#EEF5F3] shadow-sm">
                <span className="text-4xl mb-2 block">🎉</span>
                <h4 className="font-heading font-bold text-lg text-[#285E5B]">
                  ¡Todo listo por hoy!
                </h4>
                <p className="text-xs text-[#6d7a77] mt-1 mb-4">
                  No hay recordatorios pendientes para hoy con {selectedPet.name}.
                </p>
                <button
                  onClick={() => setIsAddReminderOpen(true)}
                  className="py-2.5 px-5 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-xs shadow-sm btn-bounce"
                >
                  + Agregar Tarea
                </button>
              </div>
            ) : (
              todayItems.map((rem) => {
                const style = getCategoryDetails(rem.category);
                return (
                  <div
                    key={rem.id}
                    onClick={(e) => handleToggle(rem.id, e)}
                    className="bg-white rounded-2xl p-4 flex items-center justify-between soft-shadow border border-[#EEF5F3] hover:bg-[#FAF9F2] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm flex-shrink-0 ${style.bg}`}>
                        {style.emoji}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-heading font-bold text-base text-[#374745] truncate">
                          {rem.title}
                        </h4>
                        <p className="text-xs text-[#6d7a77] flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-[#4DB6AC]" />
                          <span className="font-semibold text-[#285E5B]">{rem.time}</span>
                          {rem.recurrence === 'daily' && (
                            <span className="text-[10px] bg-[#EEF5F3] px-2 py-0.5 rounded-full font-bold text-[#285E5B]">
                              Diario
                            </span>
                          )}
                          {rem.description && (
                            <span className="truncate text-[#6d7a77]">· {rem.description}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteReminder(rem.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#ba1a1a] transition-opacity p-1.5"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleToggle(rem.id, e)}
                        className="w-9 h-9 rounded-full border-2 border-[#bdc9c6] text-transparent hover:border-[#4DB6AC] hover:text-[#4DB6AC] flex items-center justify-center transition-all btn-bounce"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {activeTab === 'upcoming' && (
          <>
            {upcomingItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#EEF5F3] shadow-sm">
                <span className="text-4xl mb-2 block">📅</span>
                <h4 className="font-heading font-bold text-lg text-[#285E5B]">
                  Sin próximos recordatorios
                </h4>
                <p className="text-xs text-[#6d7a77] mt-1">
                  Programa vacunas futuras, citas de control o baños programados.
                </p>
              </div>
            ) : (
              upcomingItems.map((rem) => {
                const style = getCategoryDetails(rem.category);
                return (
                  <div
                    key={rem.id}
                    className="bg-white rounded-2xl p-4 flex items-center justify-between soft-shadow border border-[#EEF5F3]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm flex-shrink-0 ${style.bg}`}>
                        {style.emoji}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-heading font-bold text-base text-[#374745] truncate">
                          {rem.title}
                        </h4>
                        <p className="text-xs text-[#6d7a77] flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-[#4DB6AC]" />
                          <span className="font-bold text-[#285E5B]">{rem.date}</span>
                          <span>a las {rem.time}</span>
                          {rem.description && (
                            <span className="truncate text-[#6d7a77]">· {rem.description}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteReminder(rem.id)}
                      className="text-gray-400 hover:text-[#ba1a1a] transition-colors p-2"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#EEF5F3] shadow-sm">
                <p className="text-sm text-[#6d7a77]">Aún no hay tareas marcadas como completadas.</p>
              </div>
            ) : (
              completedItems.map((rem) => {
                const style = getCategoryDetails(rem.category);
                return (
                  <div
                    key={rem.id}
                    onClick={(e) => handleToggle(rem.id, e)}
                    className="bg-white/70 rounded-2xl p-4 flex items-center justify-between border border-[#EEF5F3] opacity-75 hover:opacity-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${style.bg}`}>
                        {style.emoji}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-heading font-bold text-base text-[#6d7a77] line-through truncate">
                          {rem.title}
                        </h4>
                        <span className="text-xs text-[#4DB6AC] font-bold">Completado ✓</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteReminder(rem.id);
                        }}
                        className="text-gray-400 hover:text-[#ba1a1a] p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="w-8 h-8 rounded-full bg-[#4DB6AC] text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>

      {/* Tip de Salud Card (Matches Image 7.png) */}
      <div className="bg-[#FAF9F2] border-2 border-[#4DB6AC]/40 rounded-3xl p-5 flex items-start gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-[#4DB6AC] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#285E5B]">
            Tip de Bienestar para {selectedPet.name}
          </span>
          <p className="font-heading font-bold text-sm text-[#374745] mt-1">
            Recuerda mantener agua fresca y limpia siempre accesible, especialmente luego de paseos o actividades al aire libre.
          </p>
        </div>
      </div>

      {/* Modal */}
      <AddReminderModal
        isOpen={isAddReminderOpen}
        onClose={() => setIsAddReminderOpen(false)}
      />

    </div>
  );
};
