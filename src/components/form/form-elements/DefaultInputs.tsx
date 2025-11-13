"use client";
import React, { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import Select from '../Select';
import { ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from '../../../icons';
import DatePicker from '@/components/form/date-picker';

interface DefaultInputsProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

export default function DefaultInputs({ formData, onInputChange }: DefaultInputsProps) {
  return (
    <ComponentCard title="Input Laporan">
      <div className="space-y-6">
        <div>
          <Label>Nomor Surat Jalan</Label>
          <Input 
            type="text" 
            value={formData?.surat_jalan || ''}
            onChange={(e) => onInputChange('surat_jalan', e.target.value)}
          />
        </div>
        <div>
          <Label>Nomor Seal</Label>
          <Input 
            type="text" 
            value={formData?.no_seal || ''}
            onChange={(e) => onInputChange('no_seal', e.target.value)}
          />
        </div>
        <div>
          <Label>Nomor Invoice</Label>
          <Input 
            type="text" 
            value={formData?.no_invoice || ''}
            onChange={(e) => onInputChange('no_invoice', e.target.value)}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
