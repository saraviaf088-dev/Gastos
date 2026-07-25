import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { exportFullBackupJSON } from '../../utils/exportImport';
import { clearAllData } from '../../utils/storage';
import { 
  KeyRound, Download, Trash2, Lock, Landmark, 
  Smartphone, RefreshCw, Copy, Check, QrCode, ShieldCheck, Zap
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
    syncCode,
    updateSyncCode,
    syncStatus,
    lastSyncedAt
  } = useFinance();

  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [msg, setMsg] = useState(null);
  const [balanceInput, setBalanceInput] = useState(initialBalance.toString());
  const [balanceMsg, setBalanceMsg] = useState(null);

  // Sync Code Input State
  const [inputCode, setInputCode] = useState(syncCode);
  const [codeCopied, setCodeCopied] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

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

  const handleSyncCodeSubmit = (e) => {
    e.preventDefault();
    if (!inputCode || !inputCode.trim()) {
      setSyncMsg({ type: 'error', text: 'Ingresa un código de sincronización válido.' });
      return;
    }
    updateSyncCode(inputCode.trim());
    setSyncMsg({ type: 'success', text: `¡Dispositivo vinculado con el código ${inputCode.trim().toUpperCase()}! Datos sincronizados en tiempo real.` });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(syncCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2500);
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
          <span>Configuración, Seguridad & Sincronización</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Administra la sincronización multidispositivo en tiempo real (PC y Móvil), credenciales privadas y copias de respaldo.
        </p>
      </div>

      {/* Real-time PC <-> Mobile Cloud Sync Panel */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-emerald-500/30 bg-emerald-950/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/50">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-extrabold text-white">Sincronización en Tiempo Real (PC ↔ Móvil)</h3>
                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  syncStatus === 'connected'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : syncStatus === 'syncing'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${syncStatus === 'connected' ? 'bg-emerald-400 animate-ping' : syncStatus === 'syncing' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                  <span>{syncStatus === 'connected' ? 'En Vivo' : syncStatus === 'syncing' ? 'Sincronizando...' : 'Local'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cualquier cambio realizado en la PC se verá reflejado inmediatamente en tu teléfono móvil y viceversa, sin tener que limpiar el caché.
              </p>
            </div>
          </div>
        </div>

        {/* Sync Code Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Código Actual de Sincronización Multidispositivo
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xl sm:text-2xl font-black tracking-widest text-emerald-400 font-mono bg-slate-950 px-3 py-1 rounded-xl border border-emerald-500/30">
                  {syncCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 active:scale-95"
                  title="Copiar código"
                >
                  {codeCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                  <span>{codeCopied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-500">
              <p>Última actualización recibida:</p>
              <p className="font-bold text-slate-300">
                {lastSyncedAt ? lastSyncedAt.toLocaleTimeString('es-ES') : 'En espera de cambios...'}
              </p>
            </div>
          </div>

          {/* Form to change code or link mobile */}
          <form onSubmit={handleSyncCodeSubmit} className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <div className="flex-1">
              <input
                type="text"
                value={inputCode}
                onChange={e => setInputCode(e.target.value.toUpperCase())}
                placeholder="Ej: MI-FINANZA-2026"
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-emerald-400 font-mono font-bold rounded-xl px-4 py-2 text-xs uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition flex items-center justify-center space-x-1.5 whitespace-nowrap active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Vincular con este Código</span>
            </button>
          </form>

          {syncMsg && (
            <p className={`text-xs font-semibold mt-1 ${syncMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {syncMsg.text}
            </p>
          )}
        </div>

        {/* Step by step guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/60 flex items-start space-x-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
            <p className="text-slate-300">Abre esta misma página web en tu teléfono móvil o tablet.</p>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/60 flex items-start space-x-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
            <p className="text-slate-300">Ingresa el código <strong className="text-emerald-400 font-mono">{syncCode}</strong> en la sección de Sincronización.</p>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/60 flex items-start space-x-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
            <p className="text-slate-300">¡Listo! Cualquier cambio se actualizará en ambos al instante sin limpiar el caché.</p>
          </div>
        </div>
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
