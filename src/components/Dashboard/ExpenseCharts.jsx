import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, CURRENCY_SYMBOL } from '../../utils/currency';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export const ExpenseCharts = () => {
  const { financials, categories } = useFinance();
  const { expenseByCategory, totalIncome, totalExpense, initialBalance } = financials;

  // Doughnut Chart Data (Expenses by Category)
  const categoryNames = Object.keys(expenseByCategory);
  const categoryAmounts = Object.values(expenseByCategory);
  
  const categoryColors = categoryNames.map(name => {
    const found = categories.find(c => c.name === name);
    return found ? found.color : '#3b82f6';
  });

  const doughnutData = {
    labels: categoryNames.length > 0 ? categoryNames : ['Sin gastos registrados'],
    datasets: [
      {
        data: categoryAmounts.length > 0 ? categoryAmounts : [1],
        backgroundColor: categoryColors.length > 0 ? categoryColors : ['#334155'],
        borderColor: '#131b2e',
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 12 },
          padding: 14,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            return ` ${CURRENCY_SYMBOL} ${val.toLocaleString()}`;
          }
        }
      }
    }
  };

  // Bar Chart Data (Comparison)
  const barData = {
    labels: ['Saldo Inicial', 'Ingresos Totales', 'Gastos Totales', 'Balance Neto'],
    datasets: [
      {
        label: 'Monto',
        data: [initialBalance, totalIncome, totalExpense, financials.netBalance],
        backgroundColor: ['rgba(14, 165, 233, 0.85)', 'rgba(16, 185, 129, 0.85)', 'rgba(239, 68, 68, 0.85)', 'rgba(20, 184, 166, 0.85)'],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: ['#0ea5e9', '#10b981', '#ef4444', '#14b8a6']
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${CURRENCY_SYMBOL} ${(context.raw || 0).toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } },
        grid: { display: false }
      },
      y: {
        ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
      {/* Category Doughnut Chart */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Distribución de Gastos por Categoría</h3>
          <span className="text-xs text-slate-400">Total: {formatCurrency(totalExpense)}</span>
        </div>
        <div className="h-64 relative flex items-center justify-center">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Comparison Bar Chart */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Resumen de Flujo de Caja</h3>
          <span className="text-xs text-emerald-400 font-semibold">Tasa de Ahorro: {financials.savingsRate.toFixed(1)}%</span>
        </div>
        <div className="h-64 relative">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};
