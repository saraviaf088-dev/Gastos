import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Upload, FileText, CheckCircle2, Paperclip, AlertCircle } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../utils/currency';

export const QuickActionModal = () => {
  const {
    isQuickActionOpen,
    setIsQuickActionOpen,
    quickActionType,
    categories,
    addIncome,
    addExpense
  } = useFinance();

  const [type, setType] = useState(quickActionType || 'expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta de Débito');
  const [notes, setNotes] = useState('');
  const [isAntExpense, setIsAntExpense] = useState(false);

  // Attachment state
  const [attachment, setAttachment] = useState(null); // { name, type, data }
  const [reconciliationStatus, setReconciliationStatus] = useState('RECONCILED');

  if (!isQuickActionOpen) return null;

  const filteredCategories = categories.filter(c => c.type === (type === 'income' ? 'income' : 'expense'));

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (max 3MB for base64 storage)
    if (file.size > 3 * 1024 * 1024) {
      alert('El archivo supera los 3MB. Por favor sube un archivo más pequeño.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachment({
        name: file.name,
        type: file.type,
        data: event.target.result
      });
      setReconciliationStatus('RECONCILED');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const payload = {
      title,
      amount: parseFloat(amount),
      category: category || (filteredCategories[0] ? filteredCategories[0].name : 'Otros'),
      date,
      paymentMethod,
      notes,
      isAntExpense: type === 'expense' ? isAntExpense : false,
      hasAttachment: !!attachment,
      attachmentName: attachment ? attachment.name : null,
      attachmentType: attachment ? attachment.type : null,
      attachmentData: attachment ? attachment.data : null,
      reconciliationStatus: attachment ? 'RECONCILED' : reconciliationStatus
    };

    if (type === 'income') {
      addIncome(payload);
    } else {
      addExpense(payload);
    }

    // Reset & close
    setTitle('');
    setAmount('');
    setNotes('');
    setAttachment(null);
    setIsQuickActionOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full sm:max-w-lg glass-panel rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-slate-700/60">
        <button
          onClick={() => setIsQuickActionOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-extrabold text-white mb-6">Registrar Transacción</h3>

        {/* Type selector */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2.5 rounded-xl font-bold text-sm transition ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gasto (-)
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2.5 rounded-xl font-bold text-sm transition ${
              type === 'income'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ingreso (+)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Título / Concepto *</label>
            <input
              type="text"
              required
              placeholder={type === 'expense' ? 'Ej: Supermercado o Alquiler' : 'Ej: Sueldo o Pago Freelance'}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-sm transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Monto ({CURRENCY_SYMBOL}) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-sm transition font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-3 py-2.5 text-sm transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Categoría</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-3 py-2.5 text-sm transition"
              >
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Medio de Pago</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-3 py-2.5 text-sm transition"
              >
                <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="Transferencia">Transferencia Bancaria</option>
                <option value="Efectivo">Efectivo</option>
                <option value="PayPal / Stripe">PayPal / Stripe</option>
              </select>
            </div>
          </div>

          {/* Gasto hormiga option for expenses */}
          {type === 'expense' && (
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="antExpenseCheck"
                checked={isAntExpense}
                onChange={e => setIsAntExpense(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900"
              />
              <label htmlFor="antExpenseCheck" className="text-xs text-amber-300 font-medium cursor-pointer">
                Marcar como Gasto Hormiga (Cafés, caprichos o micro-compras)
              </label>
            </div>
          )}

          {/* Document Attachment / Receipt Upload Section */}
          <div className="pt-3 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Paperclip className="w-4 h-4 text-emerald-400" />
                <span>Adjuntar Comprobante (Imagen o PDF)</span>
              </span>
              <span className="text-[10px] text-slate-500">Opcional</span>
            </label>

            {attachment ? (
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-medium truncate">{attachment.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="text-rose-400 hover:text-rose-300 text-xs ml-2 underline"
                >
                  Quitar
                </button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-4 text-center bg-slate-900/50 transition">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                <p className="text-xs text-slate-300 font-medium">Haz clic o arrastra una foto del recibo / PDF</p>
                <p className="text-[10px] text-slate-500 mt-0.5">JPG, PNG o PDF hasta 3MB</p>
              </div>
            )}

            {!attachment && (
              <div className="mt-2.5">
                <label className="block text-[11px] text-slate-400 mb-1">Estado del Comprobante:</label>
                <select
                  value={reconciliationStatus}
                  onChange={e => setReconciliationStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs"
                >
                  <option value="MANUAL">Registro Manual (Sin comprobante impreso/digital)</option>
                  <option value="PENDING">Pendiente por conseguir recibo/factura</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Notas / Observaciones</label>
            <textarea
              rows={2}
              placeholder="Detalles adicionales opcionales..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-sm transition"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-sm transition shadow-lg mt-4 ${
              type === 'expense'
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            Guardar {type === 'expense' ? 'Gasto' : 'Ingreso'}
          </button>
        </form>
      </div>
    </div>
  );
};
