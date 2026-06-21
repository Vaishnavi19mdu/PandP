import React, { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerButtons?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerButtons
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#4A3428]/45 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-xl bg-[#F4F1EC] rounded-2xl border-2 border-gold-glow shadow-2xl overflow-hidden animate-float z-10">
        
        {/* Magic Glowing Accent Band */}
        <div className="h-1.5 bg-gradient-to-r from-navy via-gold-glow to-lavender-blue" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-navy/10 bg-[#F8EAE5]">
          <h3 className="font-medieval text-lg font-bold text-soft-espresso tracking-wide">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-soft-espresso/60 hover:text-soft-espresso hover:bg-[#E9DFD2]/60 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-soft-espresso text-sm leading-relaxed max-h-[70vh] overflow-y-auto font-sans">
          {children}
        </div>

        {/* Footer */}
        {footerButtons && (
          <div className="flex justify-end items-center gap-3 px-6 py-4 bg-[#F8EAE5] border-t border-navy/10">
            {footerButtons}
          </div>
        )}
      </div>
    </div>
  );
};
export default Modal;
