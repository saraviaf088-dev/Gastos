import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, FileCheck, AlertOctagon } from 'lucide-react';

export const SummaryCards = () => {
  const { financials, openQuickAction } = useFinance();
  const { totalIncome, totalExpense, netBalance, savingsRate, reconciliationStats } = financials;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Ingresos Card */}
      <div className="glass-panel rounded-2xl p-3 sm:p-5 relative overflow-hidden group hover:border-emerald-500/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Ingresos Totales</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            ${totalIncome.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-400 mt-1 flex items-center space-x-1">
            <span>Control de flujo mensual activo</span>
          </p>
        </div>
      </div>

      {/* Gastos Card */}
      <div className="glass-panel rounded-2xl p-3 sm:p-5 relative overflow-hidden group hover:border-rose-500/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Gastos Totales</span>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-extrabold text-rose-400 tracking-tight">
            ${totalExpense.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Gastos Hormiga: <strong className="text-amber-400">${financials.totalAntExpenseAmount}</strong></span>
          </div>
        </div>
      </div>

      {/* Balance Neto Card */}
      <div className="glass-panel rounded-2xl p-3 sm:p-5 relative overflow-hidden group hover:border-teal-500/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Balance Neto</span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
            netBalance >= 0 ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${
            netBalance >= 0 ? 'text-teal-300' : 'text-rose-400'
          }`}>
            ${netBalance.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {netBalance >= 0 ? 'Flujo de caja superavitario' : 'Atención: Gastos superan ingresos'}
          </p>
        </div>
      </div>

      {/* Tasa de Ahorro / Comprobantes Card */}
      <div className="glass-panel rounded-2xl p-3 sm:p-5 relative overflow-hidden group hover:border-indigo-500/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Tasa de Ahorro</span>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-extrabold text-indigo-300 tracking-tight">
            {savingsRate.toFixed(1)}%
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span className="flex items-center space-x-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{reconciliationStats.reconciledCount} con adjunto</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
