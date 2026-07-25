import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { AlertTriangle, ShieldAlert, Info, CheckCircle2, ArrowRight } from 'lucide-react';

export const AlertCenter = () => {
  const { financials, setActiveTab } = useFinance();
  const { activeAlerts } = financials;
  const [filter, setFilter] = useState('ALL');

  const filtered = activeAlerts.filter(a => {
    if (filter === 'CRITICAL') return a.type === 'CRITICAL';
    if (filter === 'WARNING') return a.type === 'WARNING';
    if (filter === 'INFO') return a.type === 'INFO';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            <span>Centro de Alertas</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Monitoreo preventivo para evitar el sobreendeudamiento y sobrepaso presupuestario.
          </p>
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            Todas ({activeAlerts.length})
          </button>
          <button
            onClick={() => setFilter('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filter === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400'
            }`}
          >
            Críticas
          </button>
          <button
            onClick={() => setFilter('WARNING')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filter === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
            }`}
          >
            Advertencias
          </button>
        </div>
      </div>

      {/* Alert Items List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="font-bold text-sm text-white">No hay alertas activas en esta categoría</p>
            <p className="text-slate-500 mt-1">¡Tus cuentas están dentro de los márgenes seguros!</p>
          </div>
        ) : (
          filtered.map(alert => (
            <div
              key={alert.id}
              className={`glass-panel rounded-2xl p-5 border flex items-start justify-between gap-4 transition ${
                alert.type === 'CRITICAL'
                  ? 'border-rose-500/50 bg-rose-950/20'
                  : alert.type === 'WARNING'
                  ? 'border-amber-500/50 bg-amber-950/20'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  alert.type === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-400'
                    : alert.type === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-indigo-500/20 text-indigo-400'
                }`}>
                  {alert.type === 'CRITICAL' ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-white text-sm">{alert.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{alert.date}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{alert.message}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('presupuestos')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white shrink-0 transition"
              >
                <span>Ajustar Límite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
