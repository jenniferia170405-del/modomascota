import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { X, Phone, MapPin, AlertTriangle, Stethoscope, Scale, ShieldAlert, Edit2, Check } from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { 
    isEmergencyOpen, 
    setIsEmergencyOpen, 
    selectedPet, 
    petMedications, 
    veterinarian, 
    updateVeterinarian 
  } = usePetContext();

  const [isEditingVet, setIsEditingVet] = useState(false);
  const [vetForm, setVetForm] = useState({
    name: veterinarian.name,
    clinic: veterinarian.clinic,
    phone: veterinarian.phone,
    address: veterinarian.address,
  });

  if (!isEmergencyOpen) return null;

  const handleSaveVet = (e: React.FormEvent) => {
    e.preventDefault();
    updateVeterinarian(vetForm);
    setIsEditingVet(false);
  };

  const activeMeds = petMedications.filter(m => m.status === 'active');

  const openNearbyVets = () => {
    window.open('https://www.google.com/maps/search/veterinaria+cerca+de+mi', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF9F2] rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-[#F47C7C]/30">
        
        {/* Top Emergency Header */}
        <div className="bg-[#F47C7C]/20 border-b border-[#F47C7C]/30 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 text-[#721A20]">
            <div className="w-9 h-9 rounded-full bg-[#F47C7C] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-2xl font-bold">emergency</span>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-[#721A20] leading-none">Emergencia</h2>
              <span className="text-xs text-[#a13d3f] font-semibold">Atención para {selectedPet?.name || 'tu mascota'}</span>
            </div>
          </div>
          <button
            onClick={() => setIsEmergencyOpen(false)}
            className="w-9 h-9 rounded-full bg-white/80 text-[#374745] hover:bg-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          
          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#374745]">
            Acciones rápidas para la atención veterinaria inmediata.
          </p>

          {/* Quick Action Buttons */}
          <div className="space-y-3">
            {/* Call Vet */}
            <a
              href={`tel:${veterinarian.phone}`}
              className="w-full bg-[#4DB6AC] text-white py-3.5 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(77,182,172,0.3)] hover:opacity-95 active:scale-98 transition-all btn-bounce font-heading font-bold text-base"
            >
              <Phone className="w-5 h-5" />
              <span>Llamar al Veterinario habitual</span>
            </a>

            {/* Find Nearby Clinic */}
            <button
              onClick={openNearbyVets}
              className="w-full bg-[#F4B183] text-[#693b17] py-3.5 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(244,177,131,0.3)] hover:opacity-95 active:scale-98 transition-all btn-bounce font-heading font-bold text-base"
            >
              <MapPin className="w-5 h-5" />
              <span>Ver Clínica más cercana</span>
            </button>
          </div>

          {/* Primary Vet Contact Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#EEF5F3]">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#EEF5F3] text-[#285E5B] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#285E5B]">Contacto Principal</h3>
                  <p className="font-semibold text-sm text-[#374745]">{veterinarian.name} · {veterinarian.clinic}</p>
                  <p className="text-sm text-[#4DB6AC] font-bold mt-0.5">{veterinarian.phone}</p>
                  {veterinarian.address && (
                    <p className="text-xs text-[#6d7a77] mt-0.5">{veterinarian.address}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsEditingVet(!isEditingVet)}
                className="text-xs text-[#4DB6AC] hover:underline font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditingVet ? 'Cancelar' : 'Editar'}</span>
              </button>
            </div>

            {/* Inline Vet Edit Form */}
            {isEditingVet && (
              <form onSubmit={handleSaveVet} className="mt-4 pt-4 border-t border-[#EEF5F3] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-[#6d7a77]">Nombre del Veterinario</label>
                    <input
                      type="text"
                      value={vetForm.name}
                      onChange={(e) => setVetForm({ ...vetForm, name: e.target.value })}
                      className="w-full text-sm p-2 rounded-xl border border-[#bdc9c6] bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6d7a77]">Clínica</label>
                    <input
                      type="text"
                      value={vetForm.clinic}
                      onChange={(e) => setVetForm({ ...vetForm, clinic: e.target.value })}
                      className="w-full text-sm p-2 rounded-xl border border-[#bdc9c6] bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6d7a77]">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      value={vetForm.phone}
                      onChange={(e) => setVetForm({ ...vetForm, phone: e.target.value })}
                      className="w-full text-sm p-2 rounded-xl border border-[#bdc9c6] bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6d7a77]">Dirección</label>
                    <input
                      type="text"
                      value={vetForm.address}
                      onChange={(e) => setVetForm({ ...vetForm, address: e.target.value })}
                      className="w-full text-sm p-2 rounded-xl border border-[#bdc9c6] bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#285E5B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 btn-bounce"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar cambios</span>
                </button>
              </form>
            )}
          </div>

          {/* Medical Summary of Selected Pet */}
          {selectedPet && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-lg text-[#285E5B] flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">medical_information</span>
                <span>Resumen Médico: {selectedPet.name}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Weight */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EEF5F3] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EEF5F3] text-[#285E5B] flex items-center justify-center flex-shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#F4B183] font-bold uppercase tracking-wider">Peso Actual</span>
                    <p className="font-heading font-bold text-lg text-[#374745]">{selectedPet.weight} kg</p>
                  </div>
                </div>

                {/* Allergies */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EEF5F3] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EEF5F3] text-[#285E5B] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-xl">coronavirus</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#F4B183] font-bold uppercase tracking-wider">Alergias</span>
                    <p className="font-semibold text-sm text-[#374745]">
                      {selectedPet.allergies || 'Ninguna registrada'}
                    </p>
                  </div>
                </div>

                {/* Medication */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EEF5F3] sm:col-span-2">
                  <span className="text-xs text-[#F4B183] font-bold uppercase tracking-wider block mb-1.5">
                    Medicación Actual
                  </span>
                  {activeMeds.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {activeMeds.map((med) => (
                        <span 
                          key={med.id}
                          className="px-3 py-1 bg-[#4DB6AC] text-white rounded-full text-xs font-bold"
                        >
                          💊 {med.name} ({med.dose}) - {med.frequency}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#6d7a77]">Sin medicamentos activos en este momento.</p>
                  )}
                </div>

                {/* Important Alert */}
                {selectedPet.important_alert && (
                  <div className="bg-[#F47C7C]/15 border border-[#F47C7C]/40 rounded-2xl p-4 sm:col-span-2 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#F47C7C] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-[#721A20] uppercase tracking-wider">Nota Importante</span>
                      <p className="font-bold text-sm text-[#374745] mt-0.5">"{selectedPet.important_alert}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Legal / Medical Disclaimer */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#6d7a77] italic">
              Esta sección proporciona información de acceso rápido y no constituye un diagnóstico médico. En caso de riesgo vital, traslade a su mascota a una clínica veterinaria con urgencias 24h.
            </p>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-white border-t border-[#EEF5F3] flex justify-end">
          <button
            onClick={() => setIsEmergencyOpen(false)}
            className="px-6 py-2.5 rounded-full bg-[#EEF5F3] text-[#285E5B] font-heading font-bold text-sm hover:bg-[#daece9] transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
