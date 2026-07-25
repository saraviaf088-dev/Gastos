import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { exportToCSV } from '../../utils/exportImport';
import { formatCurrency } from '../../utils/currency';
import { Plus, Search, FileText, Trash2, Edit2, Download, Paperclip, CheckCircle2 } from 'lucide-react';

export const IncomeManager = () => {
  const { incomes, deleteIncome, openQuickAction, openAttachmentViewer } = useFinance();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredIncomes = incomes.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(search.toLowerCase()) ||
                          inc.notes?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || inc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalFiltered = filteredIncomes.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const categoriesList = Array.from(new Set(incomes.map(i => i.category)));

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">Gestión de Ingresos (CRUD)</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Registra y audita todas tus fuentes de ingresos con o sin comprobante adjunto.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportToCSV('ingresos_finansmart', incomes)}
            className="flex items-center space-x-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
          <button
            onClick={() => openQuickAction('income')}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nuevo Ingreso</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por concepto o notas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs transition"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-2.5 text-xs"
          >
            <option value="ALL">Todas las categorías</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Income List Table / Cards */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 text-xs">
          <span className="text-slate-400 font-medium">Transacciones encontradas: {filteredIncomes.length}</span>
          <span className="font-extrabold text-emerald-400">Total Ingresos: {formatCurrency(totalFiltered)}</span>
        </div>

        {filteredIncomes.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">No hay ingresos registrados con los filtros actuales</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 uppercase text-[11px] text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Concepto</th>
                  <th className="px-5 py-3.5">Categoría</th>
                  <th className="px-5 py-3.5">Fecha</th>
                  <th className="px-5 py-3.5">Método</th>
                  <th className="px-5 py-3.5">Comprobante</th>
                  <th className="px-5 py-3.5 text-right">Monto</th>
                  <th className="px-5 py-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIncomes.map(inc => (
                  <tr key={inc.id} className="hover:bg-slate-900/40 transition">
                    <td className="px-5 py-4 font-semibold text-white">
                      {inc.title}
                      {inc.notes && <div className="text-[11px] font-normal text-slate-500 mt-0.5">{inc.notes}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        {inc.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 font-mono">{inc.date}</td>
                    <td className="px-5 py-4 text-slate-400">{inc.paymentMethod}</td>
                    <td className="px-5 py-4">
                      {inc.hasAttachment || inc.reconciliationStatus === 'RECONCILED' ? (
                        <button
                          onClick={() => openAttachmentViewer(inc, inc.title)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20 font-medium transition"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>Comprobante</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">✍️ Manual</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right font-extrabold text-emerald-400 text-sm">
                      +{formatCurrency(parseFloat(inc.amount))}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => deleteIncome(inc.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
