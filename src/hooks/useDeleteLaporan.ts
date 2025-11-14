"use client";

import { useState } from "react";
import { deleteLaporan } from "../../services/laporan.services";

export function useDeleteLaporan(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: number; itemName: string } | null>(null);

  const openDeleteModal = (id: number, itemName: string) => {
    setPendingDelete({ id, itemName });
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setPendingDelete(null);
  };

  const confirmDelete = async (): Promise<boolean> => {
    if (!pendingDelete) return false;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await deleteLaporan(pendingDelete.id);
      console.log("Delete response:", response);
      setSuccess(true);
      closeDeleteModal();
      
      // Call callback jika ada
      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Gagal menghapus laporan";
      setError(errorMessage);
      console.error("Delete error in hook:", errorMessage, err);
      closeDeleteModal();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    loading,
    error,
    success,
    isModalOpen,
    pendingDelete,
    resetState,
  };
}
