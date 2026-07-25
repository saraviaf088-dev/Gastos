import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Sparkles, TrendingDown, ArrowRight, Target, DollarSign, Calculator, CheckCircle2, TrendingUp, Wallet, PiggyBank, AlertTriangle } from 'lucide-react';
import { formatCurrency, CURRENCY_SYMBOL } from '../../utils/currency';

export const SmartAdvisor = () => {
  const { financials, incomes, expenses, initialBalance } = useFinance();
  const { recommendations, totalExpense, totalIncome, expenseByCategory, savingsRate, netBalance, healthScore, rule503020, activeAlerts } = financials;

  // Interactive Simulator state
  const [simCutRest, setSimCutRest] = useState(20);
  const [simCutAnt, setSimCutAnt] = useState(50);

  const topCategoryAmount = Object.values(expenseByCategory).sort((a, b) => b - a)[0] || 0;
  const antAmount = financials.totalAntExpenseAmount || 0;

  const monthlySavingsSimulated = (topCategoryAmount * (simCutRest / 100)) + (antAmount * (simCutAnt / 100));
  const yearlySavingsSimulated = monthlySavingsSimulated * 12;

  // Previous accumulated savings (netBalance already = initialBalance + income - expenses)
  const previousSavings = initialBalance;
  const currentSavings = netBalance;

  const now = new Date();
  const monthName = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  // Top expense categories for analysis
  const sortedCategories = Object.entries(expenseByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Health score color
  const healthColor = healthScore >= 80 ? 'text-emerald-400' : healthScore >= 60 ? 'text-amber-400' : 'text-rose-400';
  const healthLabel = healthScore >= 80 ? 'Excelente' : healthScore >= 60 ? 'Aceptable' : 'Crítico';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border border-emerald-500/30">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">Asistente Financiero IA</h2>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-300 max-w-2xl">
          Análisis automatizado de tus finanzas con recomendaciones personalizadas para optimizar tu liquidez mensual.
        </p>
      </div>

      {/* === RESUMEN MENSUAL === */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/50">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span>1. Resumen Mensual — {monthName}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Ingreso */}
          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-300 font-semibold">Ingreso Mensual</span>
            </div>
            <div className="text-2xl font-black text-emerald-400">{formatCurrency(totalIncome)}</div>
            <div className="text-[10px] text-slate-400 mt-1">{incomes.length} fuente(s) registrada(s)</div>
          </div>
          {/* Gastos */}
          <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span className="text-xs text-rose-300 font-semibold">Gastos Totales</span>
            </div>
            <div className="text-2xl font-black text-rose-400">{formatCurrency(totalExpense)}</div>
            <div className="text-[10px] text-slate-400 mt-1">{expenses.length} transacción(es)</div>
          </div>
          {/* Balance */}
          <div className={`border rounded-xl p-4 ${netBalance >= 0 ? 'bg-teal-950/30 border-teal-500/20' : 'bg-rose-950/30 border-rose-500/20'}`}>
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className={`w-4 h-4 ${netBalance >= 0 ? 'text-teal-400' : 'text-rose-400'}`} />
              <span className={`text-xs font-semibold ${netBalance >= 0 ? 'text-teal-300' : 'text-rose-300'}`}>Balance del Mes</span>
            </div>
            <div className={`text-2xl font-black ${netBalance >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
              {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">{netBalance >= 0 ? 'Sobrante' : 'Déficit'}</div>
          </div>
        </div>
      </div>

      {/* === ESTADO DEL AHORRO === */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/50">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <PiggyBank className="w-4 h-4 text-indigo-400" />
          <span>2. Estado del Ahorro</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-semibold">Ahorro Previo Acumulado</span>
            <div className="text-xl font-bold text-slate-200 mt-1">{formatCurrency(previousSavings)}</div>
          </div>
          <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4">
            <span className="text-xs text-indigo-300 font-semibold">Ahorro Total Acumulado Actual</span>
            <div className="text-xl font-black text-indigo-400 mt-1">{formatCurrency(currentSavings)}</div>
          </div>
        </div>
      </div>

      {/* === ANÁLISIS FINANCIERO BREVE === */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/50">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Target className="w-4 h-4 text-amber-400" />
          <span>3. Análisis Financiero Breve</span>
        </h3>

        <div className="space-y-4">
          {/* Health Score */}
          <div className="flex items-center space-x-3 bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
            <div className={`text-3xl font-black ${healthColor}`}>{healthScore}</div>
            <div>
              <div className="text-xs text-slate-400">Salud Financiera</div>
              <div className={`text-sm font-bold ${healthColor}`}>{healthLabel}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs text-slate-400">Tasa de Ahorro</div>
              <div className={`text-lg font-bold ${savingsRate >= 20 ? 'text-emerald-400' : savingsRate >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                {savingsRate.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Savings rate commentary */}
          <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-700/30 text-xs text-slate-300 leading-relaxed">
            {savingsRate >= 20 ? (
              <p>
                <span className="text-emerald-400 font-bold">Excelente.</span> Ahorraste el <strong>{savingsRate.toFixed(1)}%</strong> de tu ingreso este mes.
                {savingsRate >= 50 && ' Estás en una posición financiera sólida. Considera invertir parte de tu excedente.'}
              </p>
            ) : savingsRate >= 10 ? (
              <p>
                <span className="text-amber-400 font-bold">Aceptable.</span> Tu tasa de ahorro es del <strong>{savingsRate.toFixed(1)}%</strong>.
                La meta óptima es 20%. Revisa tus gastos hormiga y categorías variables para alcanzarla.
              </p>
            ) : (
              <p>
                <span className="text-rose-400 font-bold">Atención.</span> Tu tasa de ahorro es solo <strong>{savingsRate.toFixed(1)}%</strong>.
                {netBalance < 0 ? ` Estás en déficit de ${formatCurrency(Math.abs(netBalance))}. Revisa de qué fondo se está descontando.` : ' Estás al límite. Prioriza reducir gastos fijos.'}
              </p>
            )}
          </div>

          {/* Top expense breakdown */}
          {sortedCategories.length > 0 && (
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Mayores Categorías de Gasto</span>
              <div className="mt-2 space-y-2">
                {sortedCategories.map(([name, amount]) => {
                  const pct = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                  return (
                    <div key={name} className="flex items-center space-x-3">
                      <span className="text-xs text-slate-300 w-40 truncate">{name}</span>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-200 w-24 text-right">{formatCurrency(amount)}</span>
                      <span className="text-[10px] text-slate-500 w-12 text-right">{pct.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active alerts */}
          {activeAlerts.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>Alertas Activas</span>
              </span>
              {activeAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className={`rounded-xl p-3 border text-xs ${
                  alert.type === 'CRITICAL' ? 'bg-rose-950/30 border-rose-500/30 text-rose-300' :
                  alert.type === 'WARNING' ? 'bg-amber-950/30 border-amber-500/30 text-amber-300' :
                  'bg-slate-900/60 border-slate-700/50 text-slate-300'
                }`}>
                  <span className="font-bold">{alert.title}</span>
                  <span className="block mt-0.5 text-[11px] opacity-80">{alert.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* 50/30/20 Rule */}
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Regla 50 / 30 / 20</span>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { label: 'Necesidades', key: 'needs', color: 'emerald', target: 50 },
                { label: 'Deseos', key: 'wants', color: 'amber', target: 30 },
                { label: 'Ahorro', key: 'savings', color: 'indigo', target: 20 },
              ].map(({ label, key, color, target }) => {
                const data = rule503020[key];
                const over = data.percent > target;
                return (
                  <div key={key} className={`rounded-xl p-3 border text-center ${
                    over ? `bg-rose-950/20 border-rose-500/30` : `bg-${color}-950/20 border-${color}-500/30`
                  }`}>
                    <div className="text-[10px] text-slate-400">{label} ({target}%)</div>
                    <div className={`text-lg font-black ${over ? 'text-rose-400' : `text-${color}-400`}`}>
                      {data.percent.toFixed(0)}%
                    </div>
                    <div className="text-[10px] text-slate-500">{formatCurrency(data.spent)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick recommendations */}
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Recomendaciones Clave</span>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
              {totalIncome > 0 && savingsRate < 20 && (
                <li className="flex items-start space-x-2">
                  <ArrowRight className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Automatiza la transferencia del 20% ({formatCurrency(totalIncome * 0.2)}) a una cuenta de ahorro el primer día de cobro.</span>
                </li>
              )}
              {antAmount > 0 && (
                <li className="flex items-start space-x-2">
                  <ArrowRight className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                  <span>Tus gastos hormiga suman {formatCurrency(antAmount)}. Reducirlos a la mitad te ahorraría {formatCurrency(antAmount * 0.5)}/mes.</span>
                </li>
              )}
              {sortedCategories.length > 0 && (
                <li className="flex items-start space-x-2">
                  <ArrowRight className="w-3 h-3 text-indigo-400 mt-0.5 shrink-0" />
                  <span>Tu mayor gasto es "{sortedCategories[0][0]}" ({formatCurrency(sortedCategories[0][1])}). Reducirlo un 15% ahorraría {formatCurrency(sortedCategories[0][1] * 0.15)}/mes.</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Recomendaciones Accionables</h3>

        {recommendations.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-center text-slate-400 text-xs">
            ¡Excelente trabajo! Tus gastos están dentro de los parámetros saludables.
          </div>
        ) : (
          recommendations.map(rec => (
            <div
              key={rec.id}
              className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    rec.impact === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                    rec.impact === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    IMPACTO {rec.impact}
                  </span>
                  <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
                <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Paso Sugerido: {rec.actionStep}</span>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-right shrink-0 min-w-[180px]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Ahorro Mensual Est.</span>
                <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
                  +{formatCurrency(rec.potentialMonthlySavings)}/mes
                </div>
                <span className="text-[11px] text-slate-500">
                  +{formatCurrency(rec.potentialMonthlySavings * 12)} al año
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Interactive Savings Simulator */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-indigo-500/30 bg-slate-900/80">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">Simulador Interactivo de Ahorro</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Ajuste en Categoría Principal ({simCutRest}%)</span>
                <span className="text-emerald-400">Ahorro: +{formatCurrency(topCategoryAmount * (simCutRest / 100))}/mes</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={simCutRest}
                onChange={e => setSimCutRest(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Reducción de Gastos Hormiga ({simCutAnt}%)</span>
                <span className="text-amber-400">Ahorro: +{formatCurrency(antAmount * (simCutAnt / 100))}/mes</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={simCutAnt}
                onChange={e => setSimCutAnt(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-950 to-indigo-950/80 p-5 rounded-2xl border border-indigo-500/30 text-center flex flex-col justify-center">
            <span className="text-xs text-slate-400 font-semibold uppercase">Potencial de Ahorro Acumulado</span>
            <div className="text-3xl font-black text-emerald-400 mt-2">
              +{formatCurrency(monthlySavingsSimulated)} <span className="text-sm font-normal text-slate-300">/ mes</span>
            </div>
            <div className="text-lg font-bold text-teal-300 mt-1">
              +{formatCurrency(yearlySavingsSimulated)} <span className="text-xs text-slate-400">/ año</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
