import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PieChart, Edit3, Plus, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const BudgetManager = () => {
  const { categories, updateCategoryBudget, addCategory, deleteCategory, financials } = useFinance();
  const { categoryStatusList, totalExpense } = financials;

  const [editingId, setEditingId] = useState(null);
  const [newLimitInput, setNewLimitInput] = useState('');

  // Add category state
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState('expense');
  const [catColor, setCatColor] = useState('#10b981');
  const [catLimit, setCatLimit] = useState('');

  const totalAssignedBudget = categoryStatusList.reduce((acc, c) => acc + c.limit, 0);

  const handleSaveBudget = (catId) => {
    if (newLimitInput !== '') {
      updateCategoryBudget(catId, newLimitInput);
    }
    setEditingId(null);
    setNewLimitInput('');
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!catName) return;
    addCategory({
      name: catName,
      type: catType,
      color: catColor,
      icon: 'Tag',
      budgetLimit: parseFloat(catLimit) || 0
    });
    setCatName('');
    setCatLimit('');
    setIsAddCatOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">Presupuestos por Categoría (CRUD)</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Define límites mensuales y recibe alertas automáticas en tiempo real antes de gastar en exceso.
          </p>
        </div>

        <button
          onClick={() => setIsAddCatOpen(true)}
          className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-panel p-4 sm:p-5 rounded-2xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">Presupuesto Asignado</span>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">${totalAssignedBudget.toLocaleString()}</div>
        </div>
        <div className="glass-panel p-4 sm:p-5 rounded-2xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">Gasto Real Consumido</span>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-400 mt-1">${totalExpense.toLocaleString()}</div>
        </div>
        <div className="glass-panel p-4 sm:p-5 rounded-2xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">Margen Restante Global</span>
          <div className={`text-xl sm:text-2xl font-extrabold mt-1 ${
            totalAssignedBudget - totalExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            ${(totalAssignedBudget - totalExpense).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {categoryStatusList.map(cat => {
          const isEditing = editingId === cat.categoryId;
          const isExceeded = cat.status === 'EXCEEDED';
          const isWarning = cat.status === 'WARNING';

          return (
            <div
              key={cat.categoryId}
              className={`glass-panel rounded-2xl p-5 border transition ${
                isExceeded
                  ? 'border-rose-500/50 bg-rose-950/10 animate-pulse-glow'
                  : isWarning
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-bold text-white text-sm">{cat.categoryName}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {isExceeded && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-extrabold flex items-center space-x-1">
                      <ShieldAlert className="w-3 h-3" />
                      <span>¡EXCEDIDO!</span>
                    </span>
                  )}
                  {isWarning && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      ⚠️ Cerca del límite
                    </span>
                  )}

                  <button
                    onClick={() => {
                      setEditingId(cat.categoryId);
                      setNewLimitInput(cat.limit.toString());
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Modificar límite de presupuesto"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Edit Limit Inline Form */}
              {isEditing ? (
                <div className="flex items-center space-x-2 my-3 p-2 bg-slate-900 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    value={newLimitInput}
                    onChange={e => setNewLimitInput(e.target.value)}
                    className="w-full bg-transparent text-white text-sm font-bold focus:outline-none px-2"
                    placeholder="Nuevo límite $"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveBudget(cat.categoryId)}
                    className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-2 py-1 text-slate-400 text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-baseline my-2 text-xs">
                  <span className="text-slate-400">Consumido: <strong className="text-white">${cat.spent.toLocaleString()}</strong></span>
                  <span className="text-slate-400">Límite: <strong className="text-emerald-400">${cat.limit.toLocaleString()}</strong></span>
                </div>
              )}

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 mt-2">
                <div
                  className={`h-full transition-all duration-500 ${
                    isExceeded ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, cat.percentage)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
                <span>{cat.percentage.toFixed(1)}% del presupuesto</span>
                {cat.remaining > 0 ? (
                  <span className="text-emerald-400">Quedan ${cat.remaining.toLocaleString()}</span>
                ) : (
                  <span className="text-rose-400 font-bold">Sobregasto: +${cat.overspendAmount.toLocaleString()}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Custom Category */}
      {isAddCatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full sm:max-w-md glass-panel rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Nueva Categoría Personalizada</h3>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nombre de Categoría</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  placeholder="Ej: Mascotas o Gimnasio"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tipo</label>
                  <select
                    value={catType}
                    onChange={e => setCatType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="expense">Gasto</option>
                    <option value="income">Ingreso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Color representativo</label>
                  <input
                    type="color"
                    value={catColor}
                    onChange={e => setCatColor(e.target.value)}
                    className="w-full h-9 bg-slate-900 border border-slate-700 rounded-xl px-1 py-1 cursor-pointer"
                  />
                </div>
              </div>

              {catType === 'expense' && (
                <div>
                  <label className="block text-slate-400 mb-1">Presupuesto Límite Mensual ($)</label>
                  <input
                    type="number"
                    value={catLimit}
                    onChange={e => setCatLimit(e.target.value)}
                    placeholder="Ej: 500"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCatOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold"
                >
                  Crear Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
