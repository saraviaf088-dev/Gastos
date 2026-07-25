import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PieChart,
  Sparkles,
  AlertTriangle,
  Settings,
  X,
  Landmark,
  LogOut
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export const Sidebar = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, financials } = useFinance();
  const alertCount = financials.activeAlerts.length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ingresos', label: 'Ingresos (CRUD)', icon: TrendingUp },
    { id: 'gastos', label: 'Gastos (CRUD)', icon: TrendingDown },
    { id: 'presupuestos', label: 'Presupuestos', icon: PieChart },
    { id: 'optimizacion', label: 'Optimización / IA', icon: Sparkles, badge: 'IA Advisor' },
    { id: 'alertas', label: 'Alertas', icon: AlertTriangle, count: alertCount, countColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { id: 'configuracion', label: 'Seguridad & Datos', icon: Settings }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    onClose?.();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 glass-panel border-r border-slate-800 p-4 shrink-0 rounded-2xl">
        <SidebarContent
          menuItems={menuItems}
          activeTab={activeTab}
          onNavClick={handleNavClick}
          financials={financials}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 glass-panel border-r border-slate-800 p-4 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-extrabold text-white">Menú</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <SidebarContent
            menuItems={menuItems}
            activeTab={activeTab}
            onNavClick={handleNavClick}
            financials={financials}
          />
        </div>
      </aside>
    </>
  );
};

const SidebarContent = ({ menuItems, activeTab, onNavClick, financials }) => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
          Menú Principal
        </div>

        <nav className="space-y-1.5">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.countColor}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Balance & Health Summary at bottom + Logout button */}
      <div className="mt-8 space-y-3">
        {/* Initial Balance Widget */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Landmark className="w-3.5 h-3.5 text-sky-400" />
            <div className="text-xs text-slate-400">Saldo Inicial</div>
          </div>
          <div className="text-base font-extrabold text-sky-300">{formatCurrency(financials.initialBalance)}</div>
        </div>

        {/* Health Score Widget */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
          <div className="text-xs text-slate-400 mb-1">Salud Financiera</div>
          <div className="text-xl font-extrabold text-emerald-400">{financials.healthScore} / 100</div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                financials.healthScore >= 75 ? 'bg-emerald-500' : financials.healthScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${financials.healthScore}%` }}
            />
          </div>
        </div>

        {/* Dedicated Logout Button with Cache Clear */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs transition active:scale-95 mt-2"
          title="Cerrar Sesión y Vaciar Caché del Navegador"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión (Limpiar Caché)</span>
        </button>
      </div>
    </div>
  );
};
