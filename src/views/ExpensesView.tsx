import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { ExpenseCategory } from '../types';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  TrendingUp, 
  PieChart, 
  Calendar,
  Layers
} from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { 
    selectedPet, 
    pets,
    petExpenses, 
    expenses,
    deleteExpense,
    monthlyBudget,
    setMonthlyBudget
  } = usePetContext();

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [viewAllPets, setViewAllPets] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget);

  if (!selectedPet) return null;

  const currentList = viewAllPets ? expenses : petExpenses;

  // Calculate totals
  const totalAmount = currentList.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetPercent = Math.min(100, Math.round((totalAmount / (monthlyBudget || 1)) * 100));
  const isBudgetExceeded = totalAmount > monthlyBudget;

  // Group by category
  const categoryTotals: { [key in ExpenseCategory]?: number } = {};
  currentList.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const getCategoryDetails = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'Alimento': return { icon: '🍖', color: '#F4B183', bg: 'bg-[#F4B183]/20' };
      case 'Veterinario': return { icon: '🩺', color: '#F47C7C', bg: 'bg-[#F47C7C]/20' };
      case 'Higiene': return { icon: '🧼', color: '#4DB6AC', bg: 'bg-[#4DB6AC]/20' };
      case 'Medicamentos': return { icon: '💊', color: '#F4B183', bg: 'bg-[#F4B183]/20' };
      case 'Juguetes': return { icon: '🧸', color: '#4DB6AC', bg: 'bg-[#4DB6AC]/20' };
      case 'Accesorios': return { icon: '🐾', color: '#F4B183', bg: 'bg-[#F4B183]/20' };
      default: return { icon: '💰', color: '#bdc9c6', bg: 'bg-[#EEF5F3]' };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl soft-shadow border border-[#EEF5F3] dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#4DB6AC] text-white flex items-center justify-center shadow-md font-heading font-bold text-xl">
            S/
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#285E5B] dark:text-white">
              Gastos {viewAllPets ? 'de Todas las Mascotas' : `de ${selectedPet.name}`}
            </h2>
            <p className="text-xs text-[#6d7a77] dark:text-slate-400 mt-0.5">
              Control financiero en Soles peruanos
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Toggle between Current Pet and All Pets */}
          {pets.length > 1 && (
            <button
              onClick={() => setViewAllPets(!viewAllPets)}
              className={`py-2 px-3 rounded-full text-xs font-heading font-bold flex items-center gap-1.5 transition-all btn-bounce ${
                viewAllPets
                  ? 'bg-[#285E5B] text-white'
                  : 'bg-[#EEF5F3] dark:bg-slate-700 text-[#285E5B] dark:text-slate-200 hover:bg-[#daece9]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{viewAllPets ? `Solo ${selectedPet.name}` : 'Ver Todas las Mascotas'}</span>
            </button>
          )}

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex-1 sm:flex-none py-2.5 px-5 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm btn-bounce hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            <span>+ Añadir Gasto</span>
          </button>
        </div>
      </div>

      {/* Budget Control Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-3 shadow-xs">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Presupuesto Mensual</span>
            <div className="flex items-center gap-2 mt-0.5">
              {isEditingBudget ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={tempBudget}
                    onChange={e => setTempBudget(Number(e.target.value))}
                    className="px-3 py-1 text-sm border rounded-xl dark:bg-slate-900 dark:text-white font-bold w-28"
                  />
                  <button
                    onClick={() => { setMonthlyBudget(tempBudget); setIsEditingBudget(false); }}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <h4 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  S/ {monthlyBudget}
                  <button
                    onClick={() => { setTempBudget(monthlyBudget); setIsEditingBudget(true); }}
                    className="text-xs text-emerald-600 hover:underline font-normal"
                  >
                    ✏️ Editar Límit
                  </button>
                </h4>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              isBudgetExceeded 
                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' 
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {isBudgetExceeded ? '⚠️ Presupuesto Excedido' : `${budgetPercent}% Consumido`}
            </span>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isBudgetExceeded ? 'bg-red-500' : budgetPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, budgetPercent)}%` }}
          />
        </div>
      </div>

      {/* Main Expense Total Card (Matches Image 9.png) */}
      <div className="relative bg-gradient-to-br from-[#285E5B] to-[#1d4745] text-white p-6 sm:p-8 rounded-[32px] soft-shadow overflow-hidden">

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4DB6AC]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#EEF5F3]/80">
              Total Acumulado ({viewAllPets ? 'Todas las mascotas' : selectedPet.name})
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-heading font-bold text-[#4DB6AC]">S/</span>
              <h3 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight">
                {totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <p className="text-xs text-[#EEF5F3]/70 mt-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#F4B183]" />
              <span>{currentList.length} transacciones registradas</span>
            </p>
          </div>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="py-3 px-6 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-sm shadow-md hover:bg-[#3fa096] transition-all btn-bounce"
          >
            + Registrar Nuevo Gasto
          </button>
        </div>
      </div>

      {/* Category Breakdown (Matches Image 9.png) */}
      <div className="bg-white p-6 rounded-3xl soft-shadow border border-[#EEF5F3] space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-heading font-bold text-lg text-[#285E5B] flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#4DB6AC]" />
            <span>Desglose por Categoría</span>
          </h3>
          <span className="text-xs text-[#6d7a77]">Distribución del presupuesto</span>
        </div>

        {totalAmount === 0 ? (
          <p className="text-xs text-[#6d7a77] bg-[#FAF9F2] p-4 rounded-2xl border border-dashed border-[#bdc9c6]">
            No hay gastos registrados para generar el desglose.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(categoryTotals).map(([cat, amount]) => {
              const category = cat as ExpenseCategory;
              const details = getCategoryDetails(category);
              const percentage = Math.round(((amount || 0) / totalAmount) * 100);

              return (
                <div key={category} className="bg-[#FAF9F2] p-4 rounded-2xl border border-[#EEF5F3] space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{details.icon}</span>
                      <span className="font-heading font-bold text-sm text-[#374745]">{category}</span>
                    </div>
                    <span className="text-xs font-bold text-[#285E5B] bg-[#EEF5F3] px-2 py-0.5 rounded-full">
                      {percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-white overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: details.color,
                      }}
                    />
                  </div>

                  <div className="text-right">
                    <span className="font-heading font-bold text-base text-[#285E5B]">
                      S/ {(amount || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expense History List */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-xl text-[#285E5B] px-1">
          Historial de Gastos
        </h3>

        {currentList.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#EEF5F3] shadow-sm">
            <span className="text-4xl mb-2 block">💸</span>
            <h4 className="font-heading font-bold text-lg text-[#285E5B]">
              Sin gastos registrados
            </h4>
            <p className="text-xs text-[#6d7a77] mt-1 mb-4">
              Registra compras de alimentos, visitas veterinarias o medicamentos.
            </p>
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="py-2.5 px-5 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-xs shadow-sm btn-bounce"
            >
              + Añadir Primer Gasto
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl soft-shadow border border-[#EEF5F3] overflow-hidden divide-y divide-[#EEF5F3]">
            {currentList.map((exp) => {
              const details = getCategoryDetails(exp.category);
              const petName = pets.find(p => p.id === exp.pet_id)?.name || selectedPet.name;

              return (
                <div 
                  key={exp.id} 
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#FAF9F2] transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${details.bg}`}>
                      {details.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-heading font-bold text-base text-[#374745] truncate">
                        {exp.description}
                      </h4>
                      <p className="text-xs text-[#6d7a77] flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#4DB6AC]" />
                        <span>{exp.date}</span>
                        <span className="text-[#4DB6AC] font-semibold">· {exp.category}</span>
                        {viewAllPets && (
                          <span className="bg-[#EEF5F3] text-[#285E5B] px-2 py-0.2 rounded-full font-bold text-[10px]">
                            {petName}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-heading font-extrabold text-base sm:text-lg text-[#285E5B]">
                      S/ {exp.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>

                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#ba1a1a] transition-opacity p-1.5"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />

    </div>
  );
};
