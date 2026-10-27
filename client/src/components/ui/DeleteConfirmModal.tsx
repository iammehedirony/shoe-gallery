"use client";

import React from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete",
  itemName,
  isLoading = false,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-600">{title}</h3>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="text-xl font-bold text-ink/60 hover:text-ink disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-ink/80 mb-6">
          {message} {itemName && <span className="font-semibold text-ink">&ldquo;{itemName}&rdquo;</span>}? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 border border-black/20 rounded font-bold text-sm hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 bg-red-600 text-white rounded font-bold text-sm hover:bg-red-700 transition disabled:opacity-50 shadow-sm"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
