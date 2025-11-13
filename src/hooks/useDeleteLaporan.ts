"use client";

import { useState } from "react";
import { deleteLaporan } from "../../services/laporan.services";

export function useDeleteLaporan(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async (id: number, itemName: string): Promise<boolean> => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Apakah anda yakin ingin menghapus laporan ${itemName}? Tindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmed) {
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await deleteLaporan(id);
      console.log("Delete response:", response);
      setSuccess(true);
      
      // Call callback jika ada
      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Gagal menghapus laporan";
      setError(errorMessage);
      console.error("Delete error in hook:", errorMessage, err);
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
    handleDelete,
    loading,
    error,
    success,
    resetState,
  };
}
