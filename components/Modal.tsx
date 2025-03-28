"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  customContent?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  customContent,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      confirmButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-xl transform transition-all duration-200 ease-out max-h-[90vh] overflow-hidden"
        role="alertdialog"
        style={{ maxWidth: customContent ? 'auto' : '24rem' }}
      >
        {customContent ? (
          <>
            {customContent}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50">
              <div className="flex justify-end">
                <Button
                  ref={confirmButtonRef}
                  onClick={onConfirm}
                  type="button"
                  variant="secondary"
                  className="text-sm px-3 py-1.5"
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-5">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900 mb-3">
              {title}
            </h2>
            
            <p className="text-gray-600 mb-6 text-sm">{message}</p>

            <div className="flex justify-end gap-2">
              {cancelText && (
                <Button
                  variant="secondary"
                  onClick={onClose}
                  type="button"
                  className="text-sm px-3 py-1.5"
                >
                  {cancelText}
                </Button>
              )}
              <Button
                ref={confirmButtonRef}
                onClick={onConfirm}
                type="button"
                className={`text-sm px-3 py-1.5 ${
                  isDestructive 
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" 
                    : undefined
                }`}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}