import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, FileCheck, AlertOctagon, Landmark } from 'lucide-react';
import { formatCurrency, formatCurrencyShort } from '../../utils/currency';

export const SummaryCards = () => {
  const { financials, openQuickAction } = useFinance();
  const { totalIncome, totalExpense, netBalance, savingsRate, reconciliationStats, initialBalance } = financials;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Balance Inicial Card */}
      <div className="glass-panel rounded-2xl p-3 sm:p-5 relative overflow-hidden group hover:border-sky-500/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Saldo Inicial</span>
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Landmark className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-extrabold text-sky-300 tracking-tight">
            {formatCurrency(initialBalance)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Capital de partida
          </p>
        </div>
      </div>

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
            {formatCurrency(totalIncome)}
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
            {formatCurrency(totalExpense)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Gastos Hormiga: <strong className="text-amber-400">{formatCurrencyShort(financials.totalAntExpenseAmount)}</strong></span>
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
            {formatCurrency(netBalance)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {netBalance >= 0 ? 'Flujo de caja superavitario' : 'Atención: Gastos superan ingresos'}
          </p>
        </div>
      </div>
    </div>
  );
};
