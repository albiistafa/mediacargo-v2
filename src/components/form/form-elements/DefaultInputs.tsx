"use client";
import React, { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import Select from '../Select';
import { ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from '../../../icons';
import DatePicker from '@/components/form/date-picker';

export default function DefaultInputs() {
  return (
    <ComponentCard title="Input Laporan">
      <div className="space-y-6">
        <div>
          <Label>Nomor Surat Jalan</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Nomor Seal</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Nomor Invoice</Label>
          <Input type="text" />
        </div>
      </div>
    </ComponentCard>
  );
}
