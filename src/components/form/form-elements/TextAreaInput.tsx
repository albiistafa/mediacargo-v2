"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import TextArea from "../input/TextArea";
import Label from "../Label";
import Input from "../input/InputField";

interface TextAreaInputProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

export default function TextAreaInput({ formData, onInputChange }: TextAreaInputProps) {
  // Format angka ke format Rupiah (tanpa "Rp")
  const formatRupiah = (value: number | string): string => {
    if (!value && value !== 0) return '';
    
    // Convert to number if string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Format dengan separator titik untuk ribuan
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(numValue);
  };

  // Parse format Rupiah kembali ke number
  const parseRupiah = (value: string): number => {
    // Hapus semua karakter non-digit kecuali koma dan minus
    const cleaned = value.replace(/[^\d,-]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  // Auto-calculate rate_after_tax when rate_before_tax, ppn_rate, or pph_rate changes
  useEffect(() => {
    const rateBefore = typeof formData?.rate_before_tax === 'string' 
      ? parseRupiah(formData.rate_before_tax) 
      : (formData?.rate_before_tax || 0);
    const ppn = typeof formData?.ppn_rate === 'string'
      ? parseRupiah(formData.ppn_rate)
      : (formData?.ppn_rate || 0);
    const pph = typeof formData?.pph_rate === 'string'
      ? parseRupiah(formData.pph_rate)
      : (formData?.pph_rate || 0);
    
    // Formula: rate_after_tax = rate_before_tax + ppn - pph
    const calculatedTotal = rateBefore + ppn - pph;
    
    // Update with formatted value
    if (rateBefore > 0 || ppn > 0 || pph > 0) {
      onInputChange('rate_after_tax', formatRupiah(calculatedTotal));
    }
  }, [formData?.rate_before_tax, formData?.ppn_rate, formData?.pph_rate]);

  // Handle input dengan format Rupiah
  const handleCurrencyInput = (value: string, field: string) => {
    // Jika kosong, set empty string
    if (value === '') {
      onInputChange(field, '');
      return;
    }

    // Hanya izinkan angka, koma, titik, dan minus
    const regex = /^-?[\d.,]*$/;
    
    if (regex.test(value)) {
      // Parse dan format ulang
      const numValue = parseRupiah(value);
      const formatted = formatRupiah(numValue);
      onInputChange(field, formatted);
    }
  };

  return (
    <ComponentCard title="Input Tax">
      <div className="space-y-6">
        <div>
          <Label>Rate Sebelum Tax</Label>
          <Input 
            type="text"
            value={formData?.rate_before_tax || ''}
            onChange={(e) => handleCurrencyInput(e.target.value, 'rate_before_tax')}
            placeholder="Masukkan rate"
          />
        </div>
        <div>
          <Label>PPN 1.1%</Label>
          <Input 
            type="text"
            value={formData?.ppn_rate || ''}
            onChange={(e) => handleCurrencyInput(e.target.value, 'ppn_rate')}
            placeholder="Masukkan PPN"
          />
        </div>
        <div>
          <Label>PPH 2%</Label>
          <Input 
            type="text"
            value={formData?.pph_rate || ''}
            onChange={(e) => handleCurrencyInput(e.target.value, 'pph_rate')}
            placeholder="Masukkan PPH"
          />
        </div>
        <div>
          <Label>Total Setelah Tax</Label>
          <Input 
            type="text"
            value={formData?.rate_after_tax || ''}
            onChange={(e) => handleCurrencyInput(e.target.value, 'rate_after_tax')}
            placeholder="Otomatis terhitung (bisa diedit)"
          />
        </div>

        {/* Default TextArea */}
        <div>
          <Label>Keterangan</Label>
          <TextArea
            value={formData?.keterangan || ''}
            onChange={(value) => onInputChange('keterangan', value)}
            rows={6}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
