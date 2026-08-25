import React, { useRef, useEffect } from 'react';
import { usePetContext } from '../context/PetContext';
import { ChevronDown, Plus, ShieldAlert, Sparkles, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    pets, 
    selectedPet, 
    setSelectedPetId, 
    currentView, 
    setCurrentView,
    setIsEmergencyOpen, 
    setIsAddPetOpen,
    isPetSwitcherOpen,
    setIsPetSwitcherOpen,
    setIsGeminiAssistantOpen,
    setIsPetCardExportOpen,
    setIsBackupOpen,
    darkMode,
    setDarkMode,
    showAiAssistantInHeader,
    currentUser,
    setIsAuthModalOpen
  } = usePetContext();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPetSwitcherOpen(false);
      }
    };
    if (isPetSwitcherOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPetSwitcherOpen, setIsPetSwitcherOpen]);

  const getSpeciesEmoji = (species?: string) => {
    switch (species) {
      case 'Perro': return '🐶';
      case 'Gato': return '🐱';
      case 'Conejo': return '🐰';
      case 'Ave': return '🦜';
      default: return '🐾';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F2] dark:bg-slate-900 shadow-sm border-b border-[#EEF5F3] dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Left: Pet Switcher & Greeting */}
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          {/* Pet Avatar with Switcher Trigger */}
          <button
            onClick={() => setIsPetSwitcherOpen(!isPetSwitcherOpen)}
            className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full bg-[#EEF5F3] dark:bg-slate-800 hover:bg-[#daece9] border border-[#4DB6AC]/30 transition-all btn-bounce group"
            title="Cambiar de mascota"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#4DB6AC] bg-white flex-shrink-0 relative shadow-sm">
              {selectedPet?.photo ? (
                <img 
                  src={selectedPet.photo} 
                  alt={selectedPet.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg bg-[#4DB6AC]/10">
                  {getSpeciesEmoji(selectedPet?.species)}
                </div>
              )}
            </div>
            
            <div className="flex flex-col text-left">
              <span className="text-xs text-[#6d7a77] dark:text-slate-400 font-semibold leading-tight flex items-center gap-1">
                {getSpeciesEmoji(selectedPet?.species)} Mascota activa
              </span>
              <div className="flex items-center gap-1">
                <span className="font-heading font-bold text-[#285E5B] dark:text-emerald-400 text-base leading-none">
                  {selectedPet?.name || 'Seleccionar'}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#285E5B] dark:text-emerald-400 transition-transform duration-200 ${isPetSwitcherOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>

          {/* Pet Switcher Dropdown */}
          {isPetSwitcherOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-[#EEF5F3] dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#EEF5F3] dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6d7a77] dark:text-slate-400">
                  Tus Mascotas ({pets.length})
                </span>
                <button 
                  onClick={() => {
                    setIsPetSwitcherOpen(false);
                    setCurrentView('all-pets');
                  }}
                  className="text-xs text-[#4DB6AC] font-semibold hover:underline"
                >
                  Ver todas
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto py-1 space-y-1 custom-scrollbar">
                {pets.map((pet) => {
                  const isSelected = pet.id === selectedPet?.id;
                  return (
                    <button
                      key={pet.id}
                      onClick={() => {
                        setSelectedPetId(pet.id);
                        setIsPetSwitcherOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${
                        isSelected 
                          ? 'bg-[#4DB6AC]/15 border border-[#4DB6AC]/40 text-[#285E5B] dark:text-emerald-300' 
                          : 'hover:bg-[#FAF9F2] dark:hover:bg-slate-800 text-[#374745] dark:text-slate-200'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-[#4DB6AC]/40 flex-shrink-0">
                        {pet.photo ? (
                          <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm">
                            {getSpeciesEmoji(pet.species)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col text-left flex-1 min-w-0">
                        <span className="font-heading font-bold text-sm truncate">
                          {getSpeciesEmoji(pet.species)} {pet.name}
                        </span>
                        <span className="text-xs text-[#6d7a77] dark:text-slate-400 truncate">
                          {pet.breed} · {pet.weight} kg
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-[#4DB6AC] flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#EEF5F3] dark:border-slate-800 mt-1">
                <button
                  onClick={() => {
                    setIsPetSwitcherOpen(false);
                    setIsAddPetOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#4DB6AC] text-white font-semibold text-sm hover:opacity-90 transition-opacity btn-bounce"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar mascota</span>
                </button>
              </div>
            </div>
          )}

          <div className="hidden sm:block">
            <h1 className="font-heading font-bold text-lg text-[#285E5B] dark:text-white leading-none">
              Modo Mascota
            </h1>
            <span className="text-xs text-[#6d7a77] dark:text-slate-400">Cuidado y bienestar</span>
          </div>
        </div>

        {/* Right Actions: Vet AI + Pet Card + Backup + Dark Mode + Emergency */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Vet-AI Button (Conditional) */}
          {showAiAssistantInHeader && (
            <button
              onClick={() => setIsGeminiAssistantOpen(true)}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs hover:opacity-90 transition-all flex items-center gap-1"
              title="Asistente Vet-AI con Gemini"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span className="hidden md:inline">Vet-AI</span>
            </button>
          )}

          {/* Pet Card Export Button */}
          <button
            onClick={() => setIsPetCardExportOpen(true)}
            className="p-2 rounded-full bg-[#EEF5F3] dark:bg-slate-800 text-[#285E5B] dark:text-slate-200 hover:bg-[#daece9] dark:hover:bg-slate-700 transition-all text-xs font-bold flex items-center gap-1"
            title="Carnet Digital"
          >
            📄 <span className="hidden lg:inline">Carnet</span>
          </button>

          {/* Backup Button */}
          <button
            onClick={() => setIsBackupOpen(true)}
            className="p-2 rounded-full bg-[#EEF5F3] dark:bg-slate-800 text-[#285E5B] dark:text-slate-200 hover:bg-[#daece9] dark:hover:bg-slate-700 transition-all text-xs font-bold"
            title="Copia de Seguridad (Backup)"
          >
            💾
          </button>

          {/* User Account / Auth Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-2.5 py-1.5 rounded-full bg-[#EEF5F3] dark:bg-slate-800 text-[#285E5B] dark:text-emerald-300 hover:bg-[#daece9] dark:hover:bg-slate-700 transition-all text-xs font-bold flex items-center gap-1.5 border border-[#4DB6AC]/20 shadow-xs"
            title={currentUser ? `Cuenta: ${currentUser.name}` : 'Iniciar Sesión / Crear Cuenta'}
          >
            <div className="w-5 h-5 rounded-full bg-[#4DB6AC] text-white flex items-center justify-center text-[10px] font-extrabold flex-shrink-0">
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : <UserIcon className="w-3 h-3" />}
            </div>
            <span className="hidden sm:inline max-w-[90px] truncate">
              {currentUser ? currentUser.name.split(' ')[0] : 'Cuenta'}
            </span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="p-2 rounded-full bg-[#EEF5F3] dark:bg-slate-800 text-[#285E5B] dark:text-slate-200 hover:bg-[#daece9] dark:hover:bg-slate-700 transition-all text-xs font-bold"
            title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Emergency Button */}
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[#F47C7C]/20 text-[#F47C7C] hover:bg-[#F47C7C] hover:text-white transition-all btn-bounce shadow-sm relative group"
            title="Emergencia Veterinaria"
          >
            <span className="material-symbols-outlined text-xl group-hover:animate-pulse">
              emergency_home
            </span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ba1a1a] border-2 border-[#FAF9F2] animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ba1a1a] border-2 border-[#FAF9F2]" />
          </button>
        </div>
      </div>
    </header>
  );
};



