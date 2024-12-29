"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto relative">
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
};

export default Modal;
