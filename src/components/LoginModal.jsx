import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export const LoginModal = () => {
  const { login, pinError } = useAuth();
  const [pinInput, setPinInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim()) {
      login(pinInput);
    }
  };

  const handleKeypad = (num) => {
    if (pinInput.length < 6) {
      setPinInput(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
  };

  const handleQuickDemoPin = () => {
    setPinInput('1234');
    login('1234');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="w-full max-w-md glass-panel-glow rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <Lock className="w-8 h-8 text-slate-950" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Acceso Privado</h2>
          <p className="text-sm text-slate-400 mt-1">
            Ingresa tu PIN personal para acceder a tu planificador de gastos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="****"
                className="w-full text-center text-3xl font-extrabold tracking-widest bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-emerald-400 py-3.5 rounded-2xl transition"
                autoFocus
              />
            </div>
            {pinError && (
              <p className="text-xs text-rose-400 text-center mt-2 font-medium">
                {pinError}
              </p>
            )}
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypad(num)}
                className="py-3 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xl font-bold rounded-xl text-slate-200 active:scale-95 transition"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              className="py-3 bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800/80 text-sm font-semibold rounded-xl text-slate-400 active:scale-95 transition"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => handleKeypad('0')}
              className="py-3 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xl font-bold rounded-xl text-slate-200 active:scale-95 transition"
            >
              0
            </button>
            <button
              type="submit"
              className="py-3 bg-emerald-500 hover:bg-emerald-600 border border-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center active:scale-95 transition"
            >
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickDemoPin}
              className="w-full text-xs text-slate-400 hover:text-emerald-400 py-2 border border-slate-800 rounded-xl bg-slate-900/40 transition flex items-center justify-center space-x-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Ingresar con PIN de demostración (1234)</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
          Tus datos están protegidos y almacenados únicamente en tu dispositivo.
        </div>
      </div>
    </div>
  );
};
