import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { saveSupabaseCredentials, clearSupabaseCredentials } from '../lib/supabase';
import { 
  Edit3, 
  Trash2, 
  Heart, 
  Scale, 
  Calendar, 
  ShieldAlert, 
  Stethoscope, 
  Sparkles, 
  AlertTriangle, 
  User,
  Users,
  Check,
  Key,
  Bot,
  Lock,
  ChevronDown,
  Cloud
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    selectedPet, 
    pets, 
    setSelectedPetId, 
    setEditingPet, 
    setIsAddPetOpen, 
    setIsEmergencyOpen,
    setIsGeminiAssistantOpen,
    petHealthRecords,
    veterinarian,
    setCurrentView,
    showAiAssistantInHeader,
    setShowAiAssistantInHeader
  } = usePetContext();

  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('modo_mascota_gemini_key') || '');
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('modo_mascota_supabase_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('modo_mascota_supabase_key') || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  if (!selectedPet) return null;

  const handleSaveKey = () => {
    localStorage.setItem('modo_mascota_gemini_key', apiKeyInput.trim());
    setSaveStatus('Clave de API guardada de forma segura en tu navegador local.');
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleClearKey = () => {
    setApiKeyInput('');
    localStorage.removeItem('modo_mascota_gemini_key');
    setSaveStatus('Clave borrada del almacenamiento local.');
    setTimeout(() => setSaveStatus(null), 4000);
  };

  // Find latest vaccine, deworming, antipulgas
  const latestVaccine = petHealthRecords.find(r => r.type === 'Vacuna');
  const latestDeworming = petHealthRecords.find(r => r.type === 'Desparasitación');
  const latestAntipulgas = petHealthRecords.find(r => r.type === 'Antipulgas');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Pet Header Card (Matches Image 3.png) */}
      <div className="relative bg-white rounded-[32px] soft-shadow border border-[#EEF5F3] overflow-hidden p-6 sm:p-8">
        
        {/* Background ambient gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4DB6AC]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Circular Photo */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white shadow-[0_10px_25px_-5px_rgba(77,182,172,0.35)] flex-shrink-0">
            <img 
              src={selectedPet.photo} 
              alt={selectedPet.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 w-7 h-7 bg-[#4DB6AC] rounded-full border-2 border-white flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-white font-bold" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#285E5B]">
                {selectedPet.name}
              </h2>
              <span className="px-3 py-1 bg-[#F4B183] text-[#374745] font-heading font-bold text-xs rounded-full">
                {selectedPet.breed}
              </span>
              <span className="px-3 py-1 bg-[#EEF5F3] text-[#285E5B] font-heading font-bold text-xs rounded-full">
                {selectedPet.sex === 'Macho' ? '♂ Macho' : '♀ Hembra'}
              </span>
            </div>

            <p className="text-sm text-[#6d7a77] font-medium">
              {selectedPet.species} · {selectedPet.approximate_age} de edad · Color {selectedPet.color || 'Mestizo'}
            </p>

            {/* Quick Actions */}
            <div className="pt-3 flex flex-wrap gap-2.5 justify-center sm:justify-start">
              <button
                onClick={() => {
                  setEditingPet(selectedPet);
                  setIsAddPetOpen(true);
                }}
                className="py-2 px-4 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-sm btn-bounce hover:opacity-90"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Perfil</span>
              </button>

              <button
                onClick={() => setIsEmergencyOpen(true)}
                className="py-2 px-4 rounded-full bg-[#F47C7C]/20 text-[#721A20] font-heading font-bold text-xs flex items-center gap-1.5 hover:bg-[#F47C7C] hover:text-white transition-colors btn-bounce"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Ficha de Emergencia</span>
              </button>

              <button
                onClick={() => setCurrentView('all-pets')}
                className="py-2 px-4 rounded-full bg-[#EEF5F3] text-[#285E5B] font-heading font-bold text-xs flex items-center gap-1.5 hover:bg-[#daece9] transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Mis Mascotas ({pets.length})</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Vital Stats Bento Grid (Matches Image 3.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        {/* Weight */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl soft-shadow border border-[#EEF5F3] text-center space-y-1">
          <div className="w-10 h-10 rounded-full bg-[#EEF5F3] text-[#285E5B] flex items-center justify-center mx-auto mb-2">
            <Scale className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#6d7a77] uppercase tracking-wider block">Peso Actual</span>
          <p className="font-heading font-extrabold text-xl text-[#285E5B]">{selectedPet.weight} kg</p>
        </div>

        {/* Age */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl soft-shadow border border-[#EEF5F3] text-center space-y-1">
          <div className="w-10 h-10 rounded-full bg-[#F4B183]/20 text-[#693b17] flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#6d7a77] uppercase tracking-wider block">Edad</span>
          <p className="font-heading font-extrabold text-xl text-[#285E5B]">{selectedPet.approximate_age}</p>
        </div>

        {/* Birth Date */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl soft-shadow border border-[#EEF5F3] text-center space-y-1">
          <div className="w-10 h-10 rounded-full bg-[#4DB6AC]/20 text-[#285E5B] flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#6d7a77] uppercase tracking-wider block">Nacimiento</span>
          <p className="font-heading font-bold text-sm text-[#374745] mt-1">{selectedPet.birth_date || 'No registrada'}</p>
        </div>

        {/* Adoption Date */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl soft-shadow border border-[#EEF5F3] text-center space-y-1">
          <div className="w-10 h-10 rounded-full bg-[#F47C7C]/20 text-[#721a20] flex items-center justify-center mx-auto mb-2">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <span className="text-[11px] font-bold text-[#6d7a77] uppercase tracking-wider block">Adopción</span>
          <p className="font-heading font-bold text-sm text-[#374745] mt-1">{selectedPet.adoption_date || 'No registrada'}</p>
        </div>

      </div>

      {/* Health Overview Cards */}
      <div className="bg-white p-6 rounded-3xl soft-shadow border border-[#EEF5F3] space-y-4">
        <h3 className="font-heading font-bold text-lg text-[#285E5B] flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">medical_services</span>
          <span>Resumen de Cuidados Preventivos</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Vaccine summary */}
          <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#EEF5F3] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F47C7C]/20 text-[#721a20] flex items-center justify-center flex-shrink-0">
              💉
            </div>
            <div>
              <span className="text-xs text-[#6d7a77] font-bold uppercase">Última Vacuna</span>
              <p className="font-heading font-bold text-sm text-[#374745]">
                {latestVaccine ? `${latestVaccine.title} (${latestVaccine.date})` : 'Sin registro de vacuna'}
              </p>
              {latestVaccine?.next_date && (
                <span className="text-[11px] text-[#F47C7C] font-bold block mt-0.5">
                  Próximo refuerzo: {latestVaccine.next_date}
                </span>
              )}
            </div>
          </div>

          {/* Deworming summary */}
          <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#EEF5F3] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4DB6AC]/20 text-[#285E5B] flex items-center justify-center flex-shrink-0">
              🪱
            </div>
            <div>
              <span className="text-xs text-[#6d7a77] font-bold uppercase">Desparasitación</span>
              <p className="font-heading font-bold text-sm text-[#374745]">
                {latestDeworming ? `${latestDeworming.title} (${latestDeworming.date})` : 'Sin registro reciente'}
              </p>
              {latestDeworming?.next_date && (
                <span className="text-[11px] text-[#4DB6AC] font-bold block mt-0.5">
                  Próxima dosis: {latestDeworming.next_date}
                </span>
              )}
            </div>
          </div>

          {/* Antipulgas summary */}
          <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#EEF5F3] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F4B183]/20 text-[#693b17] flex items-center justify-center flex-shrink-0">
              🦟
            </div>
            <div>
              <span className="text-xs text-[#6d7a77] font-bold uppercase">Tratamiento Antipulgas</span>
              <p className="font-heading font-bold text-sm text-[#374745]">
                {latestAntipulgas ? `${latestAntipulgas.title} (${latestAntipulgas.date})` : 'Sin registro reciente'}
              </p>
            </div>
          </div>

          {/* Main Vet Contact */}
          <div className="p-4 rounded-2xl bg-[#FAF9F2] border border-[#EEF5F3] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EEF5F3] text-[#285E5B] flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#6d7a77] font-bold uppercase">Veterinario Habitual</span>
              <p className="font-heading font-bold text-sm text-[#374745]">
                {veterinarian.name} · {veterinarian.clinic}
              </p>
              <a href={`tel:${veterinarian.phone}`} className="text-xs text-[#4DB6AC] font-bold hover:underline">
                📞 {veterinarian.phone}
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Allergies & Important Alert */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Allergies */}
        <div className="bg-white p-5 rounded-2xl soft-shadow border border-[#EEF5F3] space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F4B183]">
            Alergias Conocidas
          </span>
          <p className="font-heading font-bold text-base text-[#374745]">
            {selectedPet.allergies || 'Ninguna alergia registrada'}
          </p>
        </div>

        {/* Important Alert */}
        <div className="bg-[#F47C7C]/15 border border-[#F47C7C]/40 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F47C7C]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#721A20]">
              Alerta Médica Especial
            </span>
          </div>
          <p className="font-heading font-bold text-base text-[#721A20]">
            {selectedPet.important_alert || 'Sin alertas especiales'}
          </p>
        </div>

      </div>

      {/* Notes / Personality */}
      {selectedPet.notes && (
        <div className="bg-white p-6 rounded-3xl soft-shadow border border-[#EEF5F3] space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#285E5B]">
            Notas y Personalidad
          </span>
          <p className="text-sm text-[#374745] leading-relaxed italic">
            "{selectedPet.notes}"
          </p>
        </div>
      )}

      {/* Hidden Details & AI Security Settings (Detalles Ocultos de la IA) */}
      <details className="group bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden transition-all">
        <summary className="p-5 font-heading font-bold text-sm text-[#285E5B] dark:text-emerald-300 flex items-center justify-between cursor-pointer select-none bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Configuración Oculta y Seguridad de la IA (Vet-AI)</span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#285E5B] group-open:rotate-180 transition-transform" />
        </summary>

        <div className="p-6 space-y-5 border-t border-emerald-100 bg-white">
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/60 text-xs text-emerald-900 leading-relaxed">
            🔒 <strong>Protección de Privacidad:</strong> Tu API Key de Google Gemini se guarda <u>únicamente en tu navegador local</u>. Nunca se subirá a GitHub ni a servidores externos.
          </div>

          {/* Toggle Header Visibility */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <span className="font-bold text-sm text-slate-800 block">Mostrar botón Vet-AI en la barra superior</span>
              <span className="text-xs text-slate-500">Puedes ocultar el acceso directo de la IA del menú si prefieres tenerlo despejado.</span>
            </div>
            <button
              onClick={() => setShowAiAssistantInHeader(!showAiAssistantInHeader)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                showAiAssistantInHeader ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                  showAiAssistantInHeader ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Clave de API de Google Gemini (Privada en tu dispositivo):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Ingresa tu clave (Ej. AIzaSy...)"
                className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveKey}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Guardar Clave
                </button>
                {apiKeyInput && (
                  <button
                    onClick={handleClearKey}
                    className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Borrar
                  </button>
                )}
              </div>
            </div>
            {saveStatus && (
              <p className="text-xs text-emerald-600 font-bold pt-1">
                ✓ {saveStatus}
              </p>
            )}
          </div>

          {/* Supabase Cloud Connection Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-cyan-600" />
              <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Conexión a Base de Datos en la Nube (Supabase Cloud)
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ingresa tus credenciales gratuitas de Supabase para activar la sincronización multi-dispositivo y poder iniciar sesión en tu celular y laptop al mismo tiempo.
            </p>
            <div className="space-y-2">
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="URL de Supabase (https://xyz.supabase.co)"
                className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="Clave Anónima (eyJhbGci...)"
                className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveSupabaseCredentials(supabaseUrl, supabaseKey)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Conectar Nube Supabase
                </button>
                {(supabaseUrl || supabaseKey) && (
                  <button
                    onClick={() => {
                      setSupabaseUrl('');
                      setSupabaseKey('');
                      clearSupabaseCredentials();
                    }}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Desconectar Nube
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Test Assistant Modal */}
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-500">¿Quieres hacer una consulta directa a la IA?</span>
            <button
              onClick={() => setIsGeminiAssistantOpen(true)}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:opacity-95 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Abrir Asistente Vet-AI</span>
            </button>
          </div>
        </div>
      </details>

    </div>
  );
};
