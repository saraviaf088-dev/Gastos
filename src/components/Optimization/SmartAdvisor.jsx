import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Sparkles, TrendingDown, ArrowRight, Target, DollarSign, Calculator, CheckCircle2 } from 'lucide-react';
import { formatCurrency, CURRENCY_SYMBOL } from '../../utils/currency';

export const SmartAdvisor = () => {
  const { financials } = useFinance();
  const { recommendations, totalExpense, totalIncome, expenseByCategory } = financials;

  // Interactive Simulator state
  const [simCutRest, setSimCutRest] = useState(20); // 20% cut in top category
  const [simCutAnt, setSimCutAnt] = useState(50); // 50% cut in ant expenses

  // Compute simulation projections
  const topCategoryAmount = Object.values(expenseByCategory).sort((a, b) => b - a)[0] || 0;
  const antAmount = financials.totalAntExpenseAmount || 0;

  const monthlySavingsSimulated = (topCategoryAmount * (simCutRest / 100)) + (antAmount * (simCutAnt / 100));
  const yearlySavingsSimulated = monthlySavingsSimulated * 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border border-emerald-500/30">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">Motor de Optimización IA</h2>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-300 max-w-2xl">
          Analiza automáticamente tus patrones de consumo para darte recomendaciones personalizadas con alto impacto en tu liquidez mensual.
        </p>
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
            {/* Slider 1: Top Category */}
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

            {/* Slider 2: Ant Expenses */}
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

          {/* Simulator Result Box */}
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
