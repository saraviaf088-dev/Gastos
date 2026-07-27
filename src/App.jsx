import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { SummaryCards } from './components/Dashboard/SummaryCards';
import { ExpenseCharts } from './components/Dashboard/ExpenseCharts';
import { HealthScore } from './components/Dashboard/HealthScore';
import { QuickActionModal } from './components/Dashboard/QuickActionModal';
import { AttachmentViewerModal } from './components/Modals/AttachmentViewerModal';
import { IncomeManager } from './components/CRUD/IncomeManager';
import { ExpenseManager } from './components/CRUD/ExpenseManager';
import { BudgetManager } from './components/CRUD/BudgetManager';
import { SmartAdvisor } from './components/Optimization/SmartAdvisor';
import { AlertCenter } from './components/Alerts/AlertCenter';
import { ExcessiveSpendBanner } from './components/Alerts/ExcessiveSpendBanner';
import { SecuritySettings } from './components/Settings/SecuritySettings';
import { SavingsGoals } from './components/Savings/SavingsGoals';

export function AppContent() {
  const { isAuthenticated } = useAuth();
  const { activeTab } = useFinance();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginModal />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Sticky Header */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 lg:p-8 gap-6">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* Global Excessive Spend Warning Banner */}
          <ExcessiveSpendBanner />

          {/* Active Tab Router */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              <SummaryCards />
              <HealthScore />
              <ExpenseCharts />
            </div>
          )}

          {activeTab === 'ingresos' && <IncomeManager />}
          {activeTab === 'gastos' && <ExpenseManager />}
          {activeTab === 'metas-ahorro' && <SavingsGoals />}
          {activeTab === 'presupuestos' && <BudgetManager />}
          {activeTab === 'optimizacion' && <SmartAdvisor />}
          {activeTab === 'alertas' && <AlertCenter />}
          {activeTab === 'configuracion' && <SecuritySettings />}
        </main>
      </div>

      {/* Global Modals */}
      <QuickActionModal />
      <AttachmentViewerModal />
    </div>
  );
}

export default AppContent;
