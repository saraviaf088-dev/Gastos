import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Download, FileText, ExternalLink } from 'lucide-react';

export const AttachmentViewerModal = () => {
  const { viewAttachmentModal, setViewAttachmentModal } = useFinance();

  if (!viewAttachmentModal) return null;

  const { title, name, type, data } = viewAttachmentModal;
  const isImage = type && type.startsWith('image/');
  const isPdf = type && type.includes('pdf');

  const handleDownload = () => {
    if (!data) return;
    const a = document.createElement('a');
    a.href = data;
    a.download = name || 'comprobante';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full sm:max-w-3xl glass-panel rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative border border-slate-700 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Comprobante de: {title}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{name || 'Sin nombre'}</p>
          </div>
          <div className="flex items-center space-x-2">
            {data && (
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold transition border border-emerald-500/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar</span>
              </button>
            )}
            <button
              onClick={() => setViewAttachmentModal(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 min-h-[300px]">
          {data ? (
            isImage ? (
              <img
                src={data}
                alt={name || 'Comprobante'}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg"
              />
            ) : isPdf ? (
              <iframe
                src={data}
                title="PDF Preview"
                className="w-full h-[60vh] rounded-xl border border-slate-800"
              />
            ) : (
              <div className="text-center p-6">
                <FileText className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">Archivo adjunto listo</p>
                <button
                  onClick={handleDownload}
                  className="mt-3 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Descargar Archivo
                </button>
              </div>
            )
          ) : (
            <div className="text-center text-slate-400 p-8">
              <FileText className="w-12 h-12 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium">Comprobante de demostración registrado</p>
              <p className="text-xs text-slate-500 mt-1">El comprobante visual de muestra está asociado exitosamente a este registro.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
