import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, Eye, EyeOff, Mail, UserPlus, LogIn, KeyRound, CheckCircle2, Smartphone } from 'lucide-react';

export const LoginModal = () => {
  const { login, register, authError, setAuthError, hasAccount, requestPasswordReset, verifyCode, resetPassword } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(hasAccount);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: enter identifier, 2: enter code, 3: new password, 4: success

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerIdentifier, setRegisterIdentifier] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Reset password state
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [sentCode, setSentCode] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginIdentifier.trim() && loginPassword.trim()) {
      login(loginIdentifier, loginPassword);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');

    if (registerPassword !== registerConfirmPassword) {
      setAuthError('Las contraseñas no coinciden.');
      return;
    }

    if (registerIdentifier.trim() && registerPassword.trim()) {
      register(registerIdentifier, registerPassword, registerName);
    }
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setAuthError('');
    setShowForgotPassword(false);
    resetLoginForm();
    resetRegisterForm();
    resetForgotPasswordForm();
  };

  const resetLoginForm = () => {
    setLoginIdentifier('');
    setLoginPassword('');
  };

  const resetRegisterForm = () => {
    setRegisterName('');
    setRegisterIdentifier('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
  };

  const resetForgotPasswordForm = () => {
    setResetIdentifier('');
    setResetCode('');
    setResetNewPassword('');
    setResetConfirmPassword('');
    setResetMessage('');
    setResetError('');
    setSentCode('');
    setResetStep(1);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setResetStep(1);
    resetForgotPasswordForm();
  };

  const handleSendCode = (e) => {
    e.preventDefault();
    setResetError('');
    
    const result = requestPasswordReset(resetIdentifier);
    if (result.success) {
      setSentCode(result.code);
      setResetStep(2);
      setResetMessage('Código enviado. Revisa tu correo/celular.');
    } else {
      setResetError(result.message);
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setResetError('');
    
    const result = verifyCode(resetIdentifier, resetCode);
    if (result.success) {
      setResetStep(3);
    } else {
      setResetError(result.message);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setResetError('');

    if (resetNewPassword !== resetConfirmPassword) {
      setResetError('Las contraseñas no coinciden.');
      return;
    }

    const result = resetPassword(resetIdentifier, resetCode, resetNewPassword);
    if (result.success) {
      setResetMessage(result.message);
      setResetStep(4);
    } else {
      setResetError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="w-full max-w-md glass-panel-glow rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl" />

        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            {showForgotPassword ? (
              <KeyRound className="w-8 h-8 text-slate-950" />
            ) : isLoginMode ? (
              <LogIn className="w-8 h-8 text-slate-950" />
            ) : (
              <UserPlus className="w-8 h-8 text-slate-950" />
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {showForgotPassword 
              ? 'Restablecer Contraseña'
              : isLoginMode 
                ? 'Iniciar Sesión' 
                : 'Crear Cuenta'
            }
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {showForgotPassword
              ? resetStep === 1 
                ? 'Ingresa tu correo o celular para recibir un código'
                : resetStep === 2
                  ? 'Ingresa el código que recibiste'
                  : resetStep === 3
                    ? 'Crea tu nueva contraseña'
                    : 'Contraseña restablecida exitosamente'
              : isLoginMode 
                ? 'Ingresa tus credenciales para acceder' 
                : 'Regístrate para comenzar a gestionar tus finanzas'
            }
          </p>
        </div>

        {/* Mode Switch Tabs - Only show when not in forgot password mode */}
        {!showForgotPassword && (
          <div className="flex mb-6 bg-slate-900/80 rounded-xl p-1 relative z-10">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${
                isLoginMode 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${
                !isLoginMode 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>
        )}

        {/* Login Form */}
        {isLoginMode && !showForgotPassword && (
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Correo o Celular</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="correo@ejemplo.com o +58 123 456 7890"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white pl-10 pr-4 py-3 rounded-xl transition text-sm font-medium"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white pl-10 pr-12 py-3 rounded-xl transition text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-xs text-rose-400 text-center font-medium">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 border border-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="flex flex-col space-y-2 mt-4">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition text-center"
              >
                ¿Olvidaste tu contraseña?
              </button>
              <p className="text-xs text-slate-400 text-center">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Register Form */}
        {!isLoginMode && !showForgotPassword && (
          <form onSubmit={handleRegister} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nombre (opcional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white pl-10 pr-4 py-3 rounded-xl transition text-sm font-medium"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Correo o Celular *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={registerIdentifier}
                  onChange={(e) => setRegisterIdentifier(e.target.value)}
                  placeholder="correo@ejemplo.com o +58 123 456 7890"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white pl-10 pr-4 py-3 rounded-xl transition text-sm font-medium"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Usa tu correo electrónico o número de celular para iniciar sesión
              </p>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Contraseña *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white pl-10 pr-12 py-3 rounded-xl transition text-sm font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Confirmar Contraseña *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white pl-10 pr-4 py-3 rounded-xl transition text-sm font-medium"
                  required
                />
              </div>
            </div>

            {authError && (
              <p className="text-xs text-rose-400 text-center font-medium">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 border border-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition"
            >
              <span>Crear Cuenta</span>
              <UserPlus className="w-5 h-5 stroke-[2.5]" />
            </button>

            <p className="text-xs text-slate-400 text-center mt-4">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-emerald-400 hover:text-emerald-300 font-bold transition"
              >
                Inicia sesión
              </button>
            </p>
          </form>
        )}

        {/* Forgot Password Form */}
        {showForgotPassword && (
          <div className="relative z-10">
            {/* Step 1: Enter identifier */}
            {resetStep === 1 && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="bg-sky-500/10 rounded-xl p-4 border border-sky-500/30">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5 text-sky-400" />
                    <p className="text-xs text-sky-300">
                      Se enviará un código de 6 dígitos a tu correo o celular registrado
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Correo o Celular registrado</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="correo@ejemplo.com o +58 123 456 7890"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white pl-10 pr-4 py-3 rounded-xl transition text-sm font-medium"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {resetError && (
                  <p className="text-xs text-rose-400 text-center font-medium">{resetError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 border border-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition"
                >
                  <span>Enviar Código</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); resetForgotPasswordForm(); }}
                  className="w-full text-xs text-slate-400 hover:text-emerald-400 py-2 transition text-center"
                >
                  ← Volver al inicio de sesión
                </button>
              </form>
            )}

            {/* Step 2: Enter verification code */}
            {resetStep === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                {sentCode && (
                  <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <p className="text-xs text-emerald-300 font-bold">Código enviado correctamente</p>
                    </div>
                    <div className="bg-slate-900/80 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-400 mb-1">Tu código de verificación es:</p>
                      <p className="text-2xl font-extrabold text-emerald-400 tracking-[0.5em]">{sentCode}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 text-center">
                      * En una app real, este código se enviaría por correo/SMS
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Código de Verificación</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <KeyRound className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white pl-10 pr-4 py-3 rounded-xl transition text-sm font-medium text-center text-2xl tracking-[0.3em]"
                      autoFocus
                      required
                      maxLength={6}
                    />
                  </div>
                </div>

                {resetError && (
                  <p className="text-xs text-rose-400 text-center font-medium">{resetError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 border border-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition"
                >
                  <span>Verificar Código</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={() => setResetStep(1)}
                  className="w-full text-xs text-slate-400 hover:text-emerald-400 py-2 transition text-center"
                >
                  ← Volver
                </button>
              </form>
            )}

            {/* Step 3: Enter new password */}
            {resetStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-emerald-400 font-medium">Código verificado correctamente</p>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nueva Contraseña *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white pl-10 pr-12 py-3 rounded-xl transition text-sm font-medium"
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Confirmar Nueva Contraseña *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      placeholder="Repite tu nueva contraseña"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white pl-10 pr-4 py-3 rounded-xl transition text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                {resetError && (
                  <p className="text-xs text-rose-400 text-center font-medium">{resetError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 border border-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition"
                >
                  <span>Restablecer Contraseña</span>
                  <KeyRound className="w-5 h-5 stroke-[2.5]" />
                </button>
              </form>
            )}

            {/* Step 4: Success */}
            {resetStep === 4 && (
              <div className="space-y-4 text-center">
                <div className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm text-emerald-400 font-bold mb-1">¡Contraseña restablecida!</p>
                  <p className="text-xs text-slate-400">{resetMessage}</p>
                </div>

                <button
                  onClick={() => { setShowForgotPassword(false); resetForgotPasswordForm(); setIsLoginMode(true); }}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 border border-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition"
                >
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
          Tus datos están protegidos y almacenados únicamente en tu dispositivo.
        </div>
      </div>
    </div>
  );
};
