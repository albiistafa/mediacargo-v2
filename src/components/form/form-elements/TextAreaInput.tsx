"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import TextArea from "../input/TextArea";
import Label from "../Label";
import Input from "../input/InputField";

interface TextAreaInputProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

export default function TextAreaInput({ formData, onInputChange }: TextAreaInputProps) {
  return (
    <ComponentCard title="Input Tax">
      <div className="space-y-6">
      <div>
          <Label>Rate Sebelum Tax</Label>
          <Input 
            type="number" 
            value={formData?.rate_before_tax || 0}
            onChange={(e) => onInputChange('rate_before_tax', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label>PPN 1.1%</Label>
          <Input 
            type="number" 
            value={formData?.ppn_rate || 0}
            onChange={(e) => onInputChange('ppn_rate', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label>PPH 2%</Label>
          <Input 
            type="number" 
            value={formData?.pph_rate || 0}
            onChange={(e) => onInputChange('pph_rate', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label>Total Setelah Tax</Label>
          <Input 
            type="number" 
            value={formData?.rate_after_tax || 0}
            onChange={(e) => onInputChange('rate_after_tax', parseFloat(e.target.value) || 0)}
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
