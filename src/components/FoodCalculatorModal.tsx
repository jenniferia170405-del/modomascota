import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { Utensils, Calculator, X, CheckCircle2, Flame, Info } from 'lucide-react';

export const FoodCalculatorModal: React.FC = () => {
  const { isFoodCalculatorOpen, setIsFoodCalculatorOpen, selectedPet } = usePetContext();
  
  const [weight, setWeight] = useState<number>(selectedPet?.weight || 5);
  const [activity, setActivity] = useState<'baja' | 'normal' | 'alta'>('normal');
  const [lifeStage, setLifeStage] = useState<'cachorro' | 'adulto' | 'senior'>('adulto');

  if (!isFoodCalculatorOpen || !selectedPet) return null;

  // Food dosage estimation formula based on species & activity
  const calculateGrammage = (): { dailyGrams: number; cups: number; calories: number } => {
    const isDog = selectedPet.species === 'Perro';
    
    // Base RER (Resting Energy Requirement) = 70 * (weight kg)^0.75
    const rer = 70 * Math.pow(weight, 0.75);

    let factor = 1.6; // Adult dog normal
    if (isDog) {
      if (lifeStage === 'cachorro') factor = 2.5;
      else if (lifeStage === 'senior') factor = 1.2;
      else if (activity === 'baja') factor = 1.2;
      else if (activity === 'alta') factor = 2.0;
    } else {
      // Cat
      factor = 1.2;
      if (lifeStage === 'cachorro') factor = 2.0;
      else if (activity === 'alta') factor = 1.4;
    }

    const totalCalories = Math.round(rer * factor);
    // Average kibble density: 3.5 kcal per gram, 1 cup ~ 100 grams
    const dailyGrams = Math.round(totalCalories / 3.6);
    const cups = parseFloat((dailyGrams / 110).toFixed(1));

    return { dailyGrams, cups, calories: totalCalories };
  };

  const { dailyGrams, cups, calories } = calculateGrammage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Utensils className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Calculadora de Alimentación</h3>
              <p className="text-xs text-teal-100">Ración recomendada para {selectedPet.name}</p>
            </div>
          </div>
          <button
            onClick={() => setIsFoodCalculatorOpen(false)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="p-6 space-y-5 text-slate-800 dark:text-slate-200">
          
          {/* Weight Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Peso de la Mascota (kg):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={weight}
                onChange={e => setWeight(Math.max(0.5, parseFloat(e.target.value) || 1))}
                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl font-bold text-lg"
              />
              <span className="text-sm font-semibold text-slate-500">kg</span>
            </div>
          </div>

          {/* Life Stage */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Etapa de Vida:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['cachorro', 'adulto', 'senior'] as const).map(stage => (
                <button
                  key={stage}
                  onClick={() => setLifeStage(stage)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border transition-all ${
                    lifeStage === stage
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nivel de Actividad:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['baja', 'normal', 'alta'] as const).map(act => (
                <button
                  key={act}
                  onClick={() => setActivity(act)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border transition-all ${
                    activity === act
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          {/* Results Card */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-850 border border-emerald-200 dark:border-slate-700 rounded-3xl text-center shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Ración Diaria Sugerida
            </span>

            <div className="my-3 flex items-center justify-center gap-3">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{dailyGrams}</span>
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">gramos / día</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-200/60 dark:border-slate-700 text-xs">
              <div className="p-2 bg-white/80 dark:bg-slate-900/60 rounded-xl">
                <span className="text-slate-400 block text-[10px]">En Tazas (~100g)</span>
                <strong className="text-slate-800 dark:text-slate-200 text-base">{cups} tazas</strong>
              </div>
              <div className="p-2 bg-white/80 dark:bg-slate-900/60 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Energía Diaria</span>
                <strong className="text-slate-800 dark:text-slate-200 text-base flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> {calories} kcal
                </strong>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>Divide la porción en 2 o 3 tomas al día según la rutina de tu mascota.</span>
          </div>

        </div>
      </div>
    </div>
  );
};
