"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: Toast["type"], duration?: number) => void;
  hideToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: Toast["type"], duration = 5000) => {
      const id = Date.now();
      const newToast = { id, message, type, duration };

      setToasts((current) => [...current, newToast]);

      if (duration > 0) {
        setTimeout(() => hideToast(id), duration);
      }
    },
    [hideToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div
        className="fixed top-4 right-4 z-50 space-y-2"
        role="log"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`
                px-4 py-2 rounded-lg shadow-lg text-white
                flex items-center justify-between
                ${
                  toast.type === "error"
                    ? "bg-red-500"
                    : toast.type === "success"
                    ? "bg-green-500"
                    : "bg-blue-500"
                }
              `}
              role="alert"
            >
              <span>{toast.message}</span>
              <button
                onClick={() => hideToast(toast.id)}
                className="ml-4 text-white opacity-75 hover:opacity-100"
                aria-label="Close notification"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
