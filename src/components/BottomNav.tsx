import React from 'react';
import { usePetContext, MainView } from '../context/PetContext';
import { 
  Home, 
  HeartPulse, 
  Bell, 
  BookOpen, 
  UserCircle2, 
  DollarSign, 
  AlertCircle,
  Plus
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, setIsEmergencyOpen, setIsAddPetOpen, selectedPet } = usePetContext();

  const navItems: { id: MainView; label: string; icon: React.ReactNode; symbolIcon: string }[] = [
    { id: 'home', label: 'Inicio', icon: <Home className="w-5 h-5" />, symbolIcon: 'home' },
    { id: 'health', label: 'Salud', icon: <HeartPulse className="w-5 h-5" />, symbolIcon: 'health_and_safety' },
    { id: 'reminders', label: 'Recordatorios', icon: <Bell className="w-5 h-5" />, symbolIcon: 'notifications' },
    { id: 'diary', label: 'Diario', icon: <BookOpen className="w-5 h-5" />, symbolIcon: 'auto_stories' },
    { id: 'profile', label: 'Perfil', icon: <UserCircle2 className="w-5 h-5" />, symbolIcon: 'pets' },
  ];

  return (
    <>



      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F2] dark:bg-slate-900 shadow-[0_-4px_20px_-5px_rgba(77,182,172,0.18)] border-t border-[#EEF5F3] dark:border-slate-800 px-2 py-2 flex justify-around items-center rounded-t-2xl transition-colors">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 btn-bounce min-w-[62px] ${
                isActive
                  ? 'bg-[#4DB6AC] text-white shadow-sm scale-105'
                  : 'text-[#6d7a77] dark:text-slate-400 hover:text-[#285E5B] hover:bg-[#EEF5F3] dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-2xl leading-none" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.symbolIcon}
              </span>
              <span className="text-[11px] font-bold mt-1 tracking-tight font-heading">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Floating Emergency Action Button for quick reach (Mobile) */}
      <button
        onClick={() => setIsEmergencyOpen(true)}
        className="md:hidden fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-[#F47C7C] text-white shadow-lg flex items-center justify-center btn-bounce hover:scale-105"
        title="Emergencia Veterinaria"
      >
        <span className="material-symbols-outlined text-2xl font-bold">
          emergency
        </span>
      </button>

      {/* Desktop Sidebar Navigation (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-[#FAF9F2] dark:bg-slate-900 border-r border-[#EEF5F3] dark:border-slate-800 p-6 z-40 shadow-[4px_0_20px_-5px_rgba(79,209,197,0.1)] transition-colors">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-[#4DB6AC] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-2xl">pets</span>
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-[#285E5B] dark:text-white leading-none">Modo Mascota</h2>
            <p className="text-xs text-[#6d7a77] dark:text-slate-400 mt-1">Cuidado con amor</p>
          </div>
        </div>

        {/* Selected Pet Banner Card */}
        {selectedPet && (
          <div 
            onClick={() => setCurrentView('profile')}
            className="mb-6 p-3 rounded-2xl bg-[#EEF5F3] dark:bg-slate-800 border border-[#4DB6AC]/20 flex items-center gap-3 cursor-pointer hover:bg-[#daece9] dark:hover:bg-slate-700 transition-colors"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#4DB6AC] bg-white flex-shrink-0">
              <img src={selectedPet.photo} alt={selectedPet.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#6d7a77] dark:text-slate-400 uppercase font-bold">Mascota activa</span>
              <p className="font-heading font-bold text-[#285E5B] dark:text-emerald-400 text-base truncate">{selectedPet.name}</p>
              <span className="text-xs text-[#6d7a77] dark:text-slate-400">{selectedPet.breed}</span>
            </div>
          </div>
        )}

        {/* Main Nav Items */}
        <ul className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-heading font-bold text-sm transition-all btn-bounce ${
                    isActive
                      ? 'bg-[#4DB6AC] text-white shadow-sm'
                      : 'text-[#374745] dark:text-slate-200 hover:bg-[#EEF5F3] dark:hover:bg-slate-800 hover:text-[#285E5B]'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.symbolIcon}
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}

          {/* Gastos Link */}
          <li>
            <button
              onClick={() => setCurrentView('expenses')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-heading font-bold text-sm transition-all btn-bounce ${
                currentView === 'expenses'
                  ? 'bg-[#4DB6AC] text-white shadow-sm'
                  : 'text-[#374745] dark:text-slate-200 hover:bg-[#EEF5F3] dark:hover:bg-slate-800 hover:text-[#285E5B]'
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: currentView === 'expenses' ? "'FILL' 1" : "'FILL' 0" }}>
                payments
              </span>
              <span>Gastos (S/)</span>
            </button>
          </li>

          {/* All Pets Link */}
          <li>
            <button
              onClick={() => setCurrentView('all-pets')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-heading font-bold text-sm transition-all btn-bounce ${
                currentView === 'all-pets'
                  ? 'bg-[#4DB6AC] text-white shadow-sm'
                  : 'text-[#374745] dark:text-slate-200 hover:bg-[#EEF5F3] dark:hover:bg-slate-800 hover:text-[#285E5B]'
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: currentView === 'all-pets' ? "'FILL' 1" : "'FILL' 0" }}>
                grid_view
              </span>
              <span>Mis Mascotas</span>
            </button>
          </li>
        </ul>

        {/* Bottom Sidebar Action: Emergency & Add Pet */}
        <div className="pt-4 border-t border-[#EEF5F3] dark:border-slate-800 flex flex-col gap-2">
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#F47C7C]/20 text-[#721A20] dark:text-red-300 font-heading font-bold text-sm hover:bg-[#F47C7C] hover:text-white transition-all btn-bounce"
          >
            <span className="material-symbols-outlined text-xl">emergency</span>
            <span>🚨 Emergencia</span>
          </button>

          <button
            onClick={() => setIsAddPetOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#EEF5F3] dark:bg-slate-800 text-[#285E5B] dark:text-slate-200 font-heading font-semibold text-xs hover:bg-[#daece9] dark:hover:bg-slate-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva mascota</span>
          </button>
        </div>
      </aside>

    </>
  );
};
