import React from 'react';
import { HealthRecord } from '../types';
import { TrendingUp, Scale, AlertCircle } from 'lucide-react';

interface WeightChartProps {
  records: HealthRecord[];
  currentWeight: number;
}

export const WeightChart: React.FC<WeightChartProps> = ({ records, currentWeight }) => {
  // Extract weight records (from health records or filtered by weight type / weight_value)
  const weightRecords = records
    .filter(r => r.type === 'Peso' || typeof r.weight_value === 'number')
    .map(r => ({
      date: r.date,
      weight: r.weight_value || parseFloat(r.description?.replace(/[^0-9.]/g, '') || '0') || currentWeight
    }))
    .filter(w => w.weight > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Ensure current weight is included if list is empty
  const chartData = weightRecords.length > 0 ? weightRecords : [
    { date: 'Hoy', weight: currentWeight }
  ];

  const maxWeight = Math.max(...chartData.map(d => d.weight), currentWeight + 2);
  const minWeight = Math.max(0, Math.min(...chartData.map(d => d.weight), currentWeight - 2));
  const range = maxWeight - minWeight || 1;

  const first = chartData[0]?.weight || currentWeight;
  const last = chartData[chartData.length - 1]?.weight || currentWeight;
  const diff = (last - first).toFixed(1);
  const isUp = parseFloat(diff) > 0;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
      
      {/* Title Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
            <Scale className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Control de Peso
          </h3>
          <p className="text-xs text-slate-400">Evolución e historial de peso registrado</p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{currentWeight} kg</span>
          {chartData.length > 1 && (
            <div className={`text-xs font-semibold flex items-center justify-end gap-1 ${isUp ? 'text-emerald-600' : 'text-blue-600'}`}>
              <TrendingUp className={`w-3.5 h-3.5 ${!isUp && 'rotate-180'}`} />
              {isUp ? `+${diff}` : diff} kg
            </div>
          )}
        </div>
      </div>

      {/* Visual Chart */}
      <div className="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-slate-100 dark:border-slate-700 px-2">
        {chartData.map((item, index) => {
          const heightPercent = Math.max(15, Math.min(100, ((item.weight - minWeight) / range) * 80 + 20));
          return (
            <div key={index} className="flex-1 flex flex-col items-center group relative">
              
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md font-bold whitespace-nowrap z-10 pointer-events-none">
                {item.weight} kg ({item.date})
              </div>

              {/* Bar */}
              <div 
                className="w-full max-w-[28px] bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t-xl group-hover:from-teal-600 group-hover:to-emerald-500 transition-all duration-300 shadow-xs"
                style={{ height: `${heightPercent}%` }}
              />

              {/* Label */}
              <span className="text-[10px] text-slate-400 mt-2 truncate w-full text-center">
                {item.date.slice(5) || item.date}
              </span>
            </div>
          );
        })}
      </div>

      {chartData.length === 1 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          Agrega nuevos registros de tipo "Peso" en Salud para ver la tendencia a través del tiempo.
        </div>
      )}
    </div>
  );
};
