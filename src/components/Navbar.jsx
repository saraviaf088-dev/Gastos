import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { Wallet, Bell, Plus, Lock, LogOut, ShieldCheck, FileCheck, Menu } from 'lucide-react';
import { formatCurrencyShort } from '../utils/currency';

export const Navbar = ({ onToggleSidebar }) => {
  const { financials, activeTab, setActiveTab, openQuickAction } = useFinance();
  const { logout } = useAuth();
  
  const alertCount = financials.activeAlerts.length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand & Title */}
      <div className="flex items-center space-x-3">
        {/* Hamburger Menu (mobile only) */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/50">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-emerald-400">
            FinanSmart
          </span>
          <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
            Personal Pro
          </span>
        </div>
      </div>

      {/* Quick Financial Summary Badges */}
      <div className="hidden md:flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Ingresos:</span>
          <span className="font-bold text-emerald-400">{formatCurrencyShort(financials.totalIncome)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Gastos:</span>
          <span className="font-bold text-rose-400">{formatCurrencyShort(financials.totalExpense)}</span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
          <span className="text-slate-400">Balance:</span>
          <span className={`font-extrabold ${financials.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrencyShort(financials.netBalance)}
          </span>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center space-x-3">
        {/* Quick Add Button */}
        <button
          onClick={() => openQuickAction('expense')}
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Nuevo Registro</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setActiveTab('alertas')}
          className={`relative p-2.5 rounded-xl border transition ${
            activeTab === 'alertas'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
          title="Centro de Alertas"
        >
          <Bell className="w-5 h-5" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center animate-bounce shadow-md">
              {alertCount}
            </span>
          )}
        </button>

        {/* Lock / Logout */}
        <button
          onClick={logout}
          className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition"
          title="Bloquear sesión privada"
        >
          <Lock className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
