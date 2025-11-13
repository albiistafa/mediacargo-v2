"use client";
import React, { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import Select from '../Select';
import { ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from '../../../icons';
import DatePickerWithTime from '@/components/form/date-picker-with-time';

interface DriverInputsProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

export default function DriverInputs({ formData, onInputChange }: DriverInputsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
    <ComponentCard title="Input Driver">
      <div className="space-y-6">
        <div>
          <Label>Nama Driver</Label>
          <Input 
            type="text" 
            value={formData?.driver || ''}
            onChange={(e) => onInputChange('driver', e.target.value)}
          />
        </div>
        <div>
          <Label>Jenis Mobil</Label>
          <Input 
            type="text" 
            value={formData?.mobil || ''}
            onChange={(e) => onInputChange('mobil', e.target.value)}
          />
        </div>
        <div>
          <Label>Nomor Regristasi Kendaraan</Label>
          <Input 
            type="text" 
            placeholder="B 1234 ACD"
            value={formData?.no_plat || ''}
            onChange={(e) => onInputChange('no_plat', e.target.value)}
          />
        </div>
        <div>
          <Label>Keterangan Nomor Registrasi Kendaraan</Label>
          <Input 
            type="text" 
            placeholder="Contoh: Kuning, Hitam"
            value={formData?.ket_plat || ''}
            onChange={(e) => onInputChange('ket_plat', e.target.value)}
          />
        </div>

        <div>
          <DatePickerWithTime
            id="date-picker-keberangkatan"
            label="Waktu Berangkat Mobil"
            placeholder="YYYY-MM-DD HH:MM"
            value={formData?.keberangkatan || ''}
            enableTime={true}
            dateFormat="Y-m-d H:i"
            onChange={(selectedDates, dateStr) => {
              onInputChange('keberangkatan', dateStr);
            }}
          />
        </div>
         <div>
          <DatePickerWithTime
            id="date-picker-kedatangan"
            label="Waktu Tiba Mobil"
            placeholder="YYYY-MM-DD HH:MM"
            value={formData?.kedatangan || ''}
            enableTime={true}
            dateFormat="Y-m-d H:i"
            onChange={(selectedDates, dateStr) => {
              onInputChange('kedatangan', dateStr);
            }}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
