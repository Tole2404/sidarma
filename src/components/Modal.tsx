import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-neutral-900 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-neutral-800 transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-neutral-800 rounded-t">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button
              type="button"
              className="text-neutral-400 bg-transparent hover:bg-neutral-800 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-colors"
              onClick={onClose}
            >
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Tutup modal</span>
            </button>
          </div>
          
          {/* Body */}
          <div className="p-4 md:p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
