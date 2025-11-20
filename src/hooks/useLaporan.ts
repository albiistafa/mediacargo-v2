"use client";

import { useState } from "react";
import { postLaporan } from "../../services/laporan.services";
import { PostLaporanRequest, RuteSelection } from "../../types/laporan";

export function useLaporan() {
  const [formData, setFormData] = useState<PostLaporanRequest>({
    ritase: "",
    trip: "",
    rute: "",
    driver: "",
    surat_jalan: "",
    no_seal: "",
    no_plat: "",
    ket_plat: "",
    mobil: "",
    keberangkatan: "",
    kedatangan: "",
    rate_before_tax: 0,
    ppn_rate: 0,
    pph_rate: 0,
    rate_after_tax: 0,
    keterangan: "",
    no_invoice: "",
  });

  const [ruteSelections, setRuteSelections] = useState<RuteSelection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (field: keyof PostLaporanRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationError(null);
  };

  const handleRuteChange = (rutes: RuteSelection[]) => {
    setRuteSelections(rutes);
    setValidationError(null);
    
    // Rute IDs akan diproses saat submit untuk memastikan data fresh
    // Di sini kita hanya update state untuk menampilkan UI
  };

  const validateForm = () => {
    if (ruteSelections.length === 0) {
      setValidationError('Minimal 1 rute harus dipilih');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Helper function to parse date string
      const parseDateTime = (dateStr: string): Date => {
        // Format: "YYYY-MM-DD HH:MM" or "YYYY-MM-DD"
        if (!dateStr) throw new Error('Date is required');
        
        try {
          // Parse the date string
          const date = new Date(dateStr);
          
          // Check if date is valid
          if (isNaN(date.getTime())) {
            throw new Error(`Invalid date format: ${dateStr}`);
          }
          
          return date;
        } catch (err) {
          throw new Error(`Invalid date: ${dateStr}`);
        }
      };

      // Helper function to parse Rupiah string to number
      const parseRupiah = (value: string | number): number => {
        if (typeof value === 'number') return value;
        if (!value) return 0;
        const cleaned = value.toString().replace(/[^\d,-]/g, '').replace(',', '.');
        return parseFloat(cleaned) || 0;
      };

      // Build ruteList array with urutan (sequence number)
      const ruteList = ruteSelections.map((rute, index) => ({
        rute_id: rute.ruteId,
        urutan: index + 1,
      }));
      
      // Create final form data with ruteList, parsed dates, and parsed numbers
      const finalFormData = {
        ...formData,
        keberangkatan: parseDateTime(formData.keberangkatan),
        kedatangan: parseDateTime(formData.kedatangan),
        rate_before_tax: parseRupiah(formData.rate_before_tax),
        ppn_rate: parseRupiah(formData.ppn_rate),
        pph_rate: parseRupiah(formData.pph_rate),
        rate_after_tax: parseRupiah(formData.rate_after_tax),
        ruteList,
      };
      
      console.log('Final form data being sent:', finalFormData);
      console.log('Rute list:', ruteList);
      
      const response = await postLaporan(finalFormData as any);
      setSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        ritase: "",
        trip: "",
        rute: "",
        driver: "",
        surat_jalan: "",
        no_seal: "",
        no_plat: "",
        ket_plat: "",
        mobil: "",
        keberangkatan: "",
        kedatangan: "",
        rate_before_tax: 0,
        ppn_rate: 0,
        pph_rate: 0,
        rate_after_tax: 0,
        keterangan: "",
        no_invoice: "",
      });
      setRuteSelections([]);
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan laporan");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    ruteSelections,
    handleInputChange,
    handleRuteChange,
    loading,
    error,
    validationError,
    success,
    handleSubmit,
    setFormData,
  };
}
