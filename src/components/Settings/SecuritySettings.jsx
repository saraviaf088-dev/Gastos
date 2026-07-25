import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { exportFullBackupJSON } from '../../utils/exportImport';
import { clearAllData } from '../../utils/storage';
import { KeyRound, ShieldCheck, Download, RefreshCw, Trash2, CheckCircle2, Lock } from 'lucide-react';

export const SecuritySettings = () => {
  const { currentPin, updatePin } = useAuth();
  const { incomes, expenses, categories } = useFinance();

  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [msg, setMsg] = useState(null);

  const handlePinChangeSubmit = (e) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      setMsg({ type: 'error', text: 'Los códigos PIN no coinciden.' });
      return;
    }
    const res = updatePin(newPin);
    if (res.success) {
      setMsg({ type: 'success', text: res.message });
      setNewPin('');
      setConfirmPin('');
    } else {
      setMsg({ type: 'error', text: res.message });
    }
  };

  const handleResetData = () => {
    if (window.confirm('¿Estás seguro de restablecer todos tus datos? Se restaurarán los valores por defecto.')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center space-x-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          <span>Seguridad y Gestión de Datos</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configura tus credenciales privadas de acceso y administra copias de respaldo de tu información.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PIN Change Form */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Cambiar PIN de Acceso Privado</span>
          </h3>

          <form onSubmit={handlePinChangeSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Nuevo PIN (mínimo 4 dígitos)</label>
              <input
                type="password"
                maxLength={6}
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                placeholder="****"
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 text-emerald-400 font-bold rounded-xl px-4 py-2.5 text-base tracking-widest"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Confirmar Nuevo PIN</label>
              <input
                type="password"
                maxLength={6}
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value)}
                placeholder="****"
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 text-emerald-400 font-bold rounded-xl px-4 py-2.5 text-base tracking-widest"
              />
            </div>

            {msg && (
              <p className={`text-xs font-semibold ${msg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {msg.text}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition text-xs mt-2"
            >
              Actualizar Clave PIN
            </button>
          </form>
        </div>

        {/* Data Backup & Reset */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Respaldo y Portabilidad de Datos</h3>
            <p className="text-xs text-slate-400 mb-4">
              Exporta una copia completa de tus ingresos, gastos, comprobantes y presupuestos en un archivo JSON local.
            </p>

            <button
              onClick={() => exportFullBackupJSON(incomes, expenses, categories)}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Copia de Respaldo Complete (JSON)</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-rose-400 mb-1">Zona de Riesgo</h4>
            <p className="text-[11px] text-slate-500 mb-3">
              Esta acción eliminará los registros actuales y restaurará los datos de demostración iniciales.
            </p>
            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Restablecer Datos Iniciales</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
