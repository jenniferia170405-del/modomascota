import React from 'react';
import { usePetContext } from '../context/PetContext';
import { Printer, Download, X, ShieldAlert, Heart, Phone, Stethoscope, FileText } from 'lucide-react';

export const PetCardExportModal: React.FC = () => {
  const { 
    isPetCardExportOpen, 
    setIsPetCardExportOpen, 
    selectedPet, 
    petHealthRecords, 
    petMedications, 
    veterinarian 
  } = usePetContext();

  if (!isPetCardExportOpen || !selectedPet) return null;

  const handlePrint = () => {
    window.print();
  };

  const vaccines = petHealthRecords.filter(r => r.type === 'Vacuna');
  const dewormings = petHealthRecords.filter(r => r.type === 'Desparasitación');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-emerald-100 dark:border-slate-800 my-auto">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2 font-bold text-lg">
            <FileText className="w-5 h-5 text-emerald-400" />
            Carnet Digital de Salud Veterinario
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" /> Imprimir / Guardar PDF
            </button>
            <button
              onClick={() => setIsPetCardExportOpen(false)}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div id="printable-pet-card" className="p-8 overflow-y-auto bg-amber-50/30 dark:bg-slate-900 font-sans space-y-6">
          
          {/* Top Banner Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 border border-emerald-600">
            
            {/* Pet Photo */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white/90 shadow-xl flex-shrink-0 bg-emerald-800">
              <img 
                src={selectedPet.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'} 
                alt={selectedPet.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-3xl font-extrabold tracking-tight">{selectedPet.name}</h1>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-xs">
                  {selectedPet.species} • {selectedPet.sex}
                </span>
              </div>
              <p className="text-emerald-100 text-sm font-medium">{selectedPet.breed || 'Mascota'}</p>
              
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-emerald-50">
                <div><span className="opacity-75">Edad:</span> <strong>{selectedPet.approximate_age || 'N/A'}</strong></div>
                <div><span className="opacity-75">Peso:</span> <strong>{selectedPet.weight} kg</strong></div>
                <div><span className="opacity-75">Color:</span> <strong>{selectedPet.color || 'N/A'}</strong></div>
              </div>
            </div>

            <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none">
              <Heart className="w-32 h-32 text-white" />
            </div>
          </div>

          {/* Important Alerts & Allergies */}
          {(selectedPet.allergies || selectedPet.important_alert) && (
            <div className="p-4 bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50 rounded-2xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <strong>Alertas / Alergias Importantes:</strong>
                <p className="mt-0.5">{selectedPet.allergies || selectedPet.important_alert}</p>
              </div>
            </div>
          )}

          {/* Grid Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Vacunas */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3 flex items-center gap-2 border-b pb-2">
                💉 Vacunas Aplicadas ({vaccines.length})
              </h3>
              {vaccines.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No hay vacunas registradas.</p>
              ) : (
                <div className="space-y-2 text-xs">
                  {vaccines.map(v => (
                    <div key={v.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{v.title}</div>
                        <div className="text-[11px] text-slate-400">{v.date}</div>
                      </div>
                      {v.next_date && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md">
                          Próx: {v.next_date}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Medicamentos Activos */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3 flex items-center gap-2 border-b pb-2">
                💊 Tratamientos y Medicinas ({petMedications.length})
              </h3>
              {petMedications.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Sin medicamentos activos.</p>
              ) : (
                <div className="space-y-2 text-xs">
                  {petMedications.map(m => (
                    <div key={m.id} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Dosis: {m.dose} • {m.frequency}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Veterinario de Cabecera */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-2xl">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">{veterinarian.name || 'Veterinario No Asignado'}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{veterinarian.clinic || 'Clínica Veterinaria'}</p>
                <p className="text-xs text-slate-400">{veterinarian.address}</p>
              </div>
            </div>

            {veterinarian.phone && (
              <a 
                href={`tel:${veterinarian.phone}`}
                className="px-4 py-2.5 bg-emerald-50 dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold text-xs flex items-center gap-2 border border-emerald-200 dark:border-slate-600"
              >
                <Phone className="w-4 h-4" /> {veterinarian.phone}
              </a>
            )}
          </div>

          {/* Watermark / Footer */}
          <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
            Modo Mascota • Documento Oficial de Registro de Salud Animal • Generado el {new Date().toLocaleDateString()}
          </div>

        </div>

      </div>
    </div>
  );
};
