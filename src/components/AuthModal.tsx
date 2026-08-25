import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { 
  User as UserIcon, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle,
  LogIn,
  UserPlus,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    currentUser, 
    loginUser, 
    registerUser, 
    logoutUser 
  } = usePetContext();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
  };

  const handleSwitchTab = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === 'login') {
      if (!username.trim() || !password) {
        setError('Por favor completa el usuario y la contraseña.');
        return;
      }
      const res = loginUser(username.trim(), password);
      if (res.success) {
        setSuccess(`¡Bienvenido de nuevo, ${res.user?.name}!`);
        setTimeout(() => {
          setIsAuthModalOpen(false);
          resetForm();
        }, 1000);
      } else {
        setError(res.error || 'Usuario o contraseña incorrectos.');
      }
    } else {
      if (!name.trim() || !username.trim() || !password) {
        setError('Todos los campos son obligatorios.');
        return;
      }
      if (password.length < 4) {
        setError('La contraseña debe tener al menos 4 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      const res = registerUser(name.trim(), username.trim(), password);
      if (res.success) {
        setSuccess(`¡Cuenta creada con éxito! Bienvenido, ${res.user?.name}.`);
        setTimeout(() => {
          setIsAuthModalOpen(false);
          resetForm();
        }, 1200);
      } else {
        setError(res.error || 'Error al registrar el usuario.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-emerald-100 dark:border-slate-800 flex flex-col relative transition-all">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-xs"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner with Ambient Glow */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-3 shadow-lg group hover:scale-105 transition-transform">
              <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl tracking-tight">
              Modo Mascota
            </h2>
            <p className="text-xs text-emerald-100 mt-1 max-w-xs leading-relaxed">
              {currentUser 
                ? `Sesión activa como @${currentUser.username}` 
                : 'Gestiona la salud, recordatorios y momentos de tus mascotas de forma privada y segura.'}
            </p>
          </div>
        </div>

        {/* User Logged In Summary View */}
        {currentUser ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-extrabold text-3xl flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-500">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-800 dark:text-white">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                @{currentUser.username}
              </p>
            </div>

            <div className="bg-emerald-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-emerald-100 dark:border-slate-700 text-xs text-emerald-800 dark:text-emerald-300 text-left space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Cuenta activa y protegida
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Tus registros de mascotas están sincronizados de forma aislada en tu perfil.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Continuar con mi cuenta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  logoutUser();
                  resetForm();
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          /* Login / Register Form */
          <div>
            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => handleSwitchTab('login')}
                className={`flex-1 py-3.5 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 transition-all ${
                  mode === 'login'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <LogIn className="w-4 h-4" /> Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => handleSwitchTab('register')}
                className={`flex-1 py-3.5 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 transition-all ${
                  mode === 'register'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <UserPlus className="w-4 h-4" /> Crear Cuenta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Feedback messages */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-2xl text-xs flex items-center gap-2 border border-red-200 dark:border-red-800 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Name field (Register only) */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Username / Email field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Usuario o Correo
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej. juan123"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password field (Register only) */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-heading font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all btn-bounce mt-2 flex items-center justify-center gap-2"
              >
                {mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Crear Mi Cuenta</span>
                  </>
                )}
              </button>

              {/* Guest Option */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="text-xs text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 font-semibold transition-colors"
                >
                  Continuar en Modo Invitado 🐾
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
