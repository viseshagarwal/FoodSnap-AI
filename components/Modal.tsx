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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all"
        role="alertdialog"
      >
        <div className="p-6">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900 mb-4">
            {title}
          </h2>
          
          {customContent ? (
            customContent
          ) : (
            <>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="flex justify-end gap-3">
                {cancelText && (
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    type="button"
                  >
                    {cancelText}
                  </Button>
                )}
                <Button
                  ref={confirmButtonRef}
                  onClick={onConfirm}
                  type="button"
                  className={
                    isDestructive 
                      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" 
                      : undefined
                  }
                >
                  {confirmText}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}