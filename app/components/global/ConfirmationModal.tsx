'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   message: string;
   confirmText?: string;
   cancelText?: string;
   variant?: 'danger' | 'primary' | 'warning';
   isLoading?: boolean;
}

export default function ConfirmationModal({
   isOpen,
   onClose,
   onConfirm,
   title,
   message,
   confirmText = 'Confirm',
   cancelText = 'Cancel',
   variant = 'primary',
   isLoading = false,
}: ConfirmationModalProps) {
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!isOpen || !mounted) return null;

   const getVariantStyles = () => {
      switch (variant) {
         case 'danger':
            return {
               icon: 'bg-red-100 text-red-600',
               button: 'bg-red-600 hover:bg-red-700 text-white',
            };
         case 'warning':
            return {
               icon: 'bg-yellow-100 text-yellow-600',
               button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
            };
         default:
            return {
               icon: 'bg-blue-100 text-blue-600',
               button: 'bg-blue-600 hover:bg-blue-700 text-white',
            };
      }
   };

   const styles = getVariantStyles();

   const modalContent = (
      <div
         className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
         onClick={onClose}
      >
         <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
         >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
               <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
               <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                  disabled={isLoading}
               >
                  <X size={20} />
               </button>
            </div>

            {/* Body */}
            <div className="p-6">
               <div className="flex items-start gap-4">
                  <div
                     className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${styles.icon}`}
                  >
                     <AlertTriangle size={24} />
                  </div>
                  <div>
                     <p className="text-gray-600 leading-relaxed">{message}</p>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-lg border-t border-gray-100">
               <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                  disabled={isLoading}
               >
                  {cancelText}
               </button>
               <button
                  onClick={onConfirm}
                  className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${styles.button}`}
                  disabled={isLoading}
               >
                  {isLoading && (
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {confirmText}
               </button>
            </div>
         </div>
      </div>
   );

   // Use portal to render outside of any parent Dialog's DOM hierarchy
   return createPortal(modalContent, document.body);
}
