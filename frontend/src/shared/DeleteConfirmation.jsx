import React from 'react';

const DeleteConfirmation = ({ deleteContext, onCancel, onConfirm }) => {
  if (!deleteContext) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] bg-surface-container-high border-l-4 border-error shadow-[0px_12px_48px_rgba(255,180,171,0.15)] p-6 rounded-xl w-96 animate-in slide-in-from-bottom-8 fade-in zoom-in-95 duration-300">
      <div className="flex items-start gap-4">
        <span className="material-symbols-outlined text-error mt-0.5 text-2xl">warning</span>
        <div className="flex-grow">
          <h4 className="text-error font-headline font-bold mb-2 uppercase tracking-widest text-sm">Confirm Deletion</h4>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6 font-body">
            {deleteContext.message}
          </p>
          <div className="flex justify-end gap-3">
            <button 
              onClick={onCancel}
              className="px-4 py-2 bg-transparent text-on-surface-variant font-label text-xs uppercase tracking-widest rounded hover:bg-surface-container-highest hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="px-4 py-2 bg-error text-on-error font-bold text-xs uppercase tracking-widest rounded hover:bg-[#ff8a7a] shadow-lg shadow-error/20 transition-all active:scale-95"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
