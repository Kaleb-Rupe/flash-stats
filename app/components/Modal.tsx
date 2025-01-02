"use client";

import React, { forwardRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, children }, ref) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
        <div
          ref={ref}
          className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto relative"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-xl text-tremor-default text-tremor-content dark:text-dark-tremor-content hover:text-white"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  }
);

// Add display name for better debugging
Modal.displayName = "Modal";

export default Modal;
