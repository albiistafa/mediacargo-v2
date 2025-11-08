"use client";
import React, { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import Select from '../Select';
import { ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from '../../../icons';
import DatePicker from '@/components/form/date-picker';

export default function DriverInputs() {
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
          <Input type="text" />
        </div>
        <div>
          <Label>Jenis Mobil</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Nomor Regristasi Kendaraan</Label>
          <Input type="text" placeholder="B 1234 ACD"/>
        </div>
        <div>
          <Label>Keterangan Nomor Registrasi Kendaraan</Label>
          <Input type="text" placeholder="Contoh: Kuning, Hitam" />
        </div>

        <div>
          <DatePicker
            id="date-picker"
            label="Waktu Berangkat Mobil"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              // Handle your logic
              console.log({ dates, currentDateString });
            }}
          />
        </div>
         <div>
          <DatePicker
            id="date-picker"
            label="Waktu Tiba Mobil"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              // Handle your logic
              console.log({ dates, currentDateString });
            }}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
