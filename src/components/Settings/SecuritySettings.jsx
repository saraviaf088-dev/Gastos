import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { exportFullBackupJSON } from '../../utils/exportImport';
import { clearAllData } from '../../utils/storage';
import { 
  KeyRound, Download, Trash2, Lock, Landmark, ShieldCheck
} from 'lucide-react';
import { formatCurrency, CURRENCY_SYMBOL } from '../../utils/currency';

export const SecuritySettings = () => {
  const { updatePin } = useAuth();
  const { 
    incomes, 
    expenses, 
    categories, 
    initialBalance, 
    updateInitialBalance,
  } = useFinance();

  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [msg, setMsg] = useState(null);
  const [balanceInput, setBalanceInput] = useState(initialBalance.toString());
  const [balanceMsg, setBalanceMsg] = useState(null);

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

  const handleBalanceSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(balanceInput);
    if (isNaN(val) || val < 0) {
      setBalanceMsg({ type: 'error', text: 'Ingresa un monto válido mayor o igual a 0.' });
      return;
    }
    updateInitialBalance(val);
    setBalanceMsg({ type: 'success', text: `Saldo inicial actualizado a ${formatCurrency(val)}.` });
  };

  const handleResetData = () => {
    if (window.confirm('¿Estás seguro de restablecer todos tus datos? Se restaurarán los valores por defecto.')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center space-x-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          <span>Configuración & Seguridad</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Administra credenciales privadas, saldo inicial y copias de respaldo.
        </p>
      </div>

      {/* Initial Balance Section */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-sky-500/30 bg-sky-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Saldo Inicial (Capital de Partida)</h3>
              <p className="text-xs text-slate-400">
                Monto con el que inicias. Se sumará a tus ingresos para calcular tu balance neto actual: <strong className="text-sky-300">{formatCurrency(initialBalance)}</strong>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleBalanceSubmit} className="mt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1">Monto inicial ({CURRENCY_SYMBOL})</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={balanceInput}
              onChange={e => setBalanceInput(e.target.value)}
              placeholder="Ej: 5000"
              className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 text-white rounded-xl px-4 py-2.5 text-sm font-bold transition"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs transition whitespace-nowrap"
          >
            Guardar Saldo
          </button>
        </form>

        {balanceMsg && (
          <p className={`text-xs font-semibold mt-2 ${balanceMsg.type === 'success' ? 'text-sky-400' : 'text-rose-400'}`}>
            {balanceMsg.text}
          </p>
        )}
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
              <span>Descargar Copia de Respaldo Completa (JSON)</span>
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
