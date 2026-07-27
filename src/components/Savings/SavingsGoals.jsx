import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Target, Plus, Trash2, Edit2, CheckCircle2, 
  PiggyBank, Calendar, TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export const SavingsGoals = () => {
  const { 
    savingsGoals, addSavingsGoal, editSavingsGoal, deleteSavingsGoal, addToSavingsGoal,
    monthlySavings, addMonthlySaving, deleteMonthlySaving,
    getMonthlySavingsSummary
  } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(null);
  const [addAmount, setAddAmount] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);
  const [showMonthlyForm, setShowMonthlyForm] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    description: '',
    color: '#10b981'
  });

  // Monthly saving form
  const [monthlyFormData, setMonthlyFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    goalId: ''
  });

  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#ef4444', '#06b6d4'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount) return;

    if (editingGoal) {
      editSavingsGoal(editingGoal.id, {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline,
        description: formData.description,
        color: formData.color
      });
    } else {
      addSavingsGoal({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline,
        description: formData.description,
        color: formData.color
      });
    }

    setFormData({ name: '', targetAmount: '', deadline: '', description: '', color: '#10b981' });
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      deadline: goal.deadline || '',
      description: goal.description || '',
      color: goal.color || '#10b981'
    });
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleAddFunds = (goalId) => {
    if (!addAmount || parseFloat(addAmount) <= 0) return;
    addToSavingsGoal(goalId, parseFloat(addAmount));
    setAddAmount('');
    setShowAddFunds(null);
  };

  const handleMonthlySubmit = (e) => {
    e.preventDefault();
    if (!monthlyFormData.amount) return;

    addMonthlySaving({
      amount: parseFloat(monthlyFormData.amount),
      date: monthlyFormData.date,
      notes: monthlyFormData.notes,
      goalId: monthlyFormData.goalId || null
    });

    setMonthlyFormData({ amount: '', date: new Date().toISOString().split('T')[0], notes: '', goalId: '' });
    setShowMonthlyForm(false);
  };

  const monthlySummary = getMonthlySavingsSummary();
  const sortedMonths = Object.keys(monthlySummary).sort().reverse();

  const getGoalProgress = (goal) => {
    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    return Math.min(progress, 100);
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span>Metas y Propósitos de Ahorro</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Establece objetivos financieros y registra tu progreso mensual
            </p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingGoal(null); setFormData({ name: '', targetAmount: '', deadline: '', description: '', color: '#10b981' }); }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Meta</span>
          </button>
        </div>
      </div>

      {/* New/Edit Goal Form */}
      {showForm && (
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-emerald-500/30 bg-emerald-950/10">
          <h3 className="text-sm font-bold text-white mb-4">
            {editingGoal ? 'Editar Meta de Ahorro' : 'Crear Nueva Meta de Ahorro'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nombre de la Meta *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Viaje a Europa"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Monto Objetivo *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.targetAmount}
                  onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="Ej: 5000"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Fecha Límite (opcional)</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Color</label>
                <div className="flex space-x-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-lg transition ${
                        formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Descripción (opcional)</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe tu meta de ahorro..."
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium resize-none"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition"
              >
                {editingGoal ? 'Guardar Cambios' : 'Crear Meta'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingGoal(null); }}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savingsGoals.length === 0 ? (
          <div className="col-span-full glass-panel rounded-2xl p-8 text-center">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No tienes metas de ahorro creadas</p>
            <p className="text-slate-500 text-xs mt-1">Crea tu primera meta para empezar a ahorrar</p>
          </div>
        ) : (
          savingsGoals.map(goal => {
            const progress = getGoalProgress(goal);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <div key={goal.id} className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                {/* Color accent */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: goal.color }}
                />

                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <PiggyBank className="w-4 h-4" style={{ color: goal.color }} />
                      )}
                      <span>{goal.name}</span>
                    </h3>
                    {goal.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{goal.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteSavingsGoal(goal.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Progreso</span>
                    <span className="font-bold" style={{ color: goal.color }}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progress}%`, backgroundColor: goal.color }}
                    />
                  </div>
                </div>

                {/* Amounts */}
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <div className="text-xs text-slate-400">Ahorrado</div>
                    <div className="text-lg font-extrabold text-white">{formatCurrency(goal.currentAmount || 0)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Objetivo</div>
                    <div className="text-sm font-bold text-slate-300">{formatCurrency(goal.targetAmount)}</div>
                  </div>
                </div>

                {/* Deadline */}
                {daysRemaining !== null && (
                  <div className={`text-xs mb-3 ${daysRemaining < 0 ? 'text-rose-400' : daysRemaining < 30 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {daysRemaining < 0 
                      ? `Vencida hace ${Math.abs(daysRemaining)} días`
                      : `${daysRemaining} días restantes`
                    }
                  </div>
                )}

                {/* Add Funds Button */}
                {showAddFunds === goal.id ? (
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={addAmount}
                      onChange={e => setAddAmount(e.target.value)}
                      placeholder="Monto"
                      className="flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-lg px-3 py-2 text-xs font-medium"
                      autoFocus
                    />
                    <button
                      onClick={() => handleAddFunds(goal.id)}
                      className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setShowAddFunds(null); setAddAmount(''); }}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddFunds(goal.id)}
                    disabled={isCompleted}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {isCompleted ? 'Meta Completada ✓' : 'Agregar Fondos'}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Monthly Savings Section */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Registro Mensual de Ahorros</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualiza tus ahorros por mes y registra nuevos depósitos
            </p>
          </div>
          <button
            onClick={() => setShowMonthlyForm(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Ahorro</span>
          </button>
        </div>

        {/* Monthly Saving Form */}
        {showMonthlyForm && (
          <div className="bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-800">
            <form onSubmit={handleMonthlySubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Monto Ahorrado *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={monthlyFormData.amount}
                    onChange={e => setMonthlyFormData({ ...monthlyFormData, amount: e.target.value })}
                    placeholder="Ej: 500"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 text-white rounded-lg px-3 py-2 text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={monthlyFormData.date}
                    onChange={e => setMonthlyFormData({ ...monthlyFormData, date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 text-white rounded-lg px-3 py-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Asociar a Meta (opcional)</label>
                  <select
                    value={monthlyFormData.goalId}
                    onChange={e => setMonthlyFormData({ ...monthlyFormData, goalId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 text-white rounded-lg px-3 py-2 text-xs font-medium"
                  >
                    <option value="">Sin asociar</option>
                    {savingsGoals.map(goal => (
                      <option key={goal.id} value={goal.id}>{goal.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Notas (opcional)</label>
                <input
                  type="text"
                  value={monthlyFormData.notes}
                  onChange={e => setMonthlyFormData({ ...monthlyFormData, notes: e.target.value })}
                  placeholder="Ej: Ahorro de expendio mensual"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 text-white rounded-lg px-3 py-2 text-xs font-medium"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs transition"
                >
                  Guardar Ahorro
                </button>
                <button
                  type="button"
                  onClick={() => setShowMonthlyForm(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Monthly Summary */}
        {sortedMonths.length === 0 ? (
          <div className="text-center py-6">
            <TrendingUp className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-xs">No hay registros de ahorro mensual</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedMonths.map(month => {
              const data = monthlySummary[month];
              const isExpanded = expandedMonth === month;
              const monthSavings = monthlySavings.filter(sav => sav.date && sav.date.startsWith(month));

              return (
                <div key={month} className="bg-slate-900/50 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setExpandedMonth(isExpanded ? null : month)}
                    className="w-full flex items-center justify-between p-3 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-sky-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          {new Date(month + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-slate-400">
                          Ahorro: <span className="text-sky-400 font-medium">{formatCurrency(data.saved)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Neto</div>
                        <div className={`text-sm font-bold ${(data.netSavings || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {formatCurrency(data.netSavings || 0)}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-slate-800">
                      <div className="grid grid-cols-3 gap-2 mt-2 mb-3">
                        <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                          <div className="text-xs text-slate-400">Ingresos</div>
                          <div className="text-sm font-bold text-emerald-400">{formatCurrency(data.income)}</div>
                        </div>
                        <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                          <div className="text-xs text-slate-400">Gastos</div>
                          <div className="text-sm font-bold text-rose-400">{formatCurrency(data.expense)}</div>
                        </div>
                        <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                          <div className="text-xs text-slate-400">Ahorro Directo</div>
                          <div className="text-sm font-bold text-sky-400">{formatCurrency(data.saved)}</div>
                        </div>
                      </div>

                      {monthSavings.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs text-slate-400 mb-1">Detalle de ahorros:</div>
                          {monthSavings.map(sav => (
                            <div key={sav.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50 last:border-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-300">{sav.notes || 'Ahorro registrado'}</span>
                                {sav.goalId && (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                                    {savingsGoals.find(g => g.id === sav.goalId)?.name || 'Meta'}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-sky-400">{formatCurrency(sav.amount)}</span>
                                <button
                                  onClick={() => deleteMonthlySaving(sav.id)}
                                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
