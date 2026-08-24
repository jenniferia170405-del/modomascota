import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { Download, Upload, X, ShieldCheck, AlertCircle, RefreshCw, Database } from 'lucide-react';

export const BackupModal: React.FC = () => {
  const { 
    isBackupOpen, 
    setIsBackupOpen, 
    exportBackupData, 
    importBackupData, 
    resetToDemoData,
    pets 
  } = usePetContext();

  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isBackupOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importBackupData(content);
        if (ok) {
          setImportStatus({ success: true, message: '¡Datos importados con éxito!' });
        } else {
          setImportStatus({ success: false, message: 'El archivo JSON no es válido o está dañado.' });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Copia de Seguridad (Backup)</h3>
              <p className="text-xs text-slate-400">Guarda o restaura los datos de tus mascotas</p>
            </div>
          </div>
          <button
            onClick={() => setIsBackupOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-slate-800 dark:text-slate-200">
          
          {/* Export Section */}
          <div className="p-4 bg-emerald-50/60 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 dark:text-emerald-300">
              <Download className="w-4 h-4 text-emerald-600" /> Exportar Copia de Seguridad
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Descarga un archivo `.json` con todas tus mascotas ({pets.length}), vacunas, gastos y notas del diario para respaldarlo en tu Google Drive o cambiar de cel.
            </p>
            <button
              onClick={exportBackupData}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm mt-2"
            >
              <Download className="w-4 h-4" /> Descargar Backup (.json)
            </button>
          </div>

          {/* Import Section */}
          <div className="p-4 bg-blue-50/60 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-blue-900 dark:text-blue-300">
              <Upload className="w-4 h-4 text-blue-600" /> Restaurar / Importar Datos
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Selecciona un archivo `.json` previamente guardado para restaurar la información en esta aplicación.
            </p>

            <label className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mt-2">
              <Upload className="w-4 h-4" /> Seleccionar Archivo Backup
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Status Alert */}
          {importStatus && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              importStatus.success 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
            }`}>
              {importStatus.success ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">¿Deseas restablecer los datos iniciales de ejemplo?</span>
            <button
              onClick={() => {
                if (confirm('¿Restablecer datos demo? Se borrarán las modificaciones actuales.')) {
                  resetToDemoData();
                  setIsBackupOpen(false);
                }
              }}
              className="text-xs text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Restablecer Demo
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
