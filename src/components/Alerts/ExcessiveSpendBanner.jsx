import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';

export const ExcessiveSpendBanner = () => {
  const { financials, setActiveTab } = useFinance();
  const criticalAlerts = financials.activeAlerts.filter(a => a.type === 'CRITICAL');
  const warningAlerts = financials.activeAlerts.filter(a => a.type === 'WARNING');

  if (criticalAlerts.length === 0 && warningAlerts.length === 0) return null;

  const topAlert = criticalAlerts[0] || warningAlerts[0];

  return (
    <div className="w-full mb-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border border-rose-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 animate-pulse-glow">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-6 h-6 animate-bounce" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-white flex items-center space-x-2">
            <span>Alerta de Gasto Excesivo</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-black">
              {financials.activeAlerts.length} ACTIVAS
            </span>
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
            {topAlert.message}
          </p>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('alertas')}
        className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shrink-0 transition shadow-lg shadow-rose-500/30"
      >
        <span>Ver Alertas</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
