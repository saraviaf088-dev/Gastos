import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Activity, ShieldCheck, FileCheck, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export const HealthScore = () => {
  const { financials } = useFinance();
  const { healthScore, rule503020, reconciliationStats } = financials;

  let healthBadge = { text: 'Excelente Salud Financiera', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  if (healthScore < 50) {
    healthBadge = { text: 'Riesgo Financiero Alto', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  } else if (healthScore < 75) {
    healthBadge = { text: 'Atención / Oportunidades de Mejora', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
      {/* Health Gauge */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Salud Financiera</span>
            </span>
            <span className={`text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold border ${healthBadge.color}`}>
              {healthBadge.text}
            </span>
          </div>

          <div className="mt-4 text-center py-4 bg-slate-900/60 rounded-2xl border border-slate-800">
            <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              {healthScore}
            </span>
            <span className="text-xl font-bold text-slate-500"> / 100</span>
            <p className="text-xs text-slate-400 mt-2 px-4">
              Calculado según disciplina presupuestaria, tasa de ahorro y control de gastos superfluos.
            </p>
          </div>
        </div>
      </div>

      {/* 50 / 30 / 20 Compliance Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-white mb-3">Distribución Ideal (Regla 50 / 30 / 20)</h3>

        <div className="space-y-3 text-xs">
          {/* Needs */}
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-300">50% Necesidades (Alquiler, Servicios, Comida)</span>
              <span className="text-emerald-400">{rule503020.needs.percent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full ${rule503020.needs.percent > 55 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, rule503020.needs.percent)}%` }}
              />
            </div>
          </div>

          {/* Wants */}
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-300">30% Deseos & Ocio (Salidas, Hormiga)</span>
              <span className="text-indigo-400">{rule503020.wants.percent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full ${rule503020.wants.percent > 35 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                style={{ width: `${Math.min(100, rule503020.wants.percent)}%` }}
              />
            </div>
          </div>

          {/* Savings */}
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-300">20% Ahorro / Inversión</span>
              <span className="text-teal-400">{rule503020.savings.percent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-teal-400"
                style={{ width: `${Math.min(100, rule503020.savings.percent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Document Reconciliation Status */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Auditoría de Comprobantes</span>
          </h3>
          <span className="text-[10px] sm:text-xs text-slate-400">{reconciliationStats.totalCount} registros</span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80 text-xs">
            <span className="flex items-center space-x-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Con Comprobante (Cuadrado)</span>
            </span>
            <span className="font-bold text-emerald-400">{reconciliationStats.reconciledCount}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80 text-xs">
            <span className="flex items-center space-x-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Pendiente de Comprobante</span>
            </span>
            <span className="font-bold text-amber-400">{reconciliationStats.pendingReceiptCount}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80 text-xs">
            <span className="flex items-center space-x-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span>Registro Manual (Sin adjunto)</span>
            </span>
            <span className="font-bold text-slate-400">{reconciliationStats.manualCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
