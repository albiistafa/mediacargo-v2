"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import Input from '../input/InputField';
import MultiSelectDuplicate from "../MultiSelectDuplicate";
import { ChevronDownIcon } from "@/icons";
import { useRute } from "@/hooks/useRute";
import { RuteSelection } from "../../../../types/laporan";

interface SelectInputsProps {
  formData: any;
  ruteSelections: RuteSelection[];
  onInputChange: (field: string, value: any) => void;
  onRuteChange: (rutes: RuteSelection[]) => void;
  validationError?: string | null;
}

export default function SelectInputs({ 
  formData, 
  ruteSelections, 
  onInputChange, 
  onRuteChange,
  validationError 
}: SelectInputsProps) {
  const { ruteList, fetchRute, loading, error } = useRute();

  const jenisRute = [
    { value: "utama", label: "Utama" },
    { value: "cabang", label: "Cabang" },
  ];

  const jenisRitase = [
    { value: "reguler", label: "Reguler" },
    { value: "dorongan", label: "Dorongan" },
  ];

  const jenisTrip = [
    { value: "satu pihak", label: "Satu Pihak" },
    { value: "dua pihak", label: "Dua Pihak" },
  ];

  useEffect(() => {
    fetchRute();
  }, []);

  const handleSelectChange = (value: string, field: string) => {
    onInputChange(field, value);
  };

  // Convert ruteList to multiOptions format
  const multiOptions = ruteList.map((rute) => ({
    value: rute.id.toString(),
    text: rute.rute,
    selected: false,
  }));

  const handleMultiSelectChange = (items: Array<{ id: string; value: string; text: string }>) => {
    // Convert dari format MultiSelectDuplicate ke RuteSelection
    const newRuteSelections: RuteSelection[] = items.map((item) => ({
      id: item.id, // unique ID dari MultiSelectDuplicate
      ruteId: parseInt(item.value),
      ruteName: item.text,
    }));
    
    onRuteChange(newRuteSelections);
  };

  return (
    <ComponentCard title="Input Rute">
      <div className="space-y-6">
        <div>
          <Label>Jenis Trip</Label>
         <div className="relative">
           <Select
            options={jenisTrip}
            placeholder="Select Option"
            onChange={(value) => handleSelectChange(value, 'trip')}
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
         </div>
         
        </div>
        <div>
          <Label>Rute Utama/Cabang</Label>
         <div className="relative">
           <Select
            options={jenisRute}
            placeholder="Select Option"
            onChange={(value) => handleSelectChange(value, 'rute')}
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
         </div>
         
        </div>

        <div className="relative">
          <MultiSelectDuplicate
            label="Input Rute"
            options={multiOptions}
            selectedItems={ruteSelections.map(r => ({
              id: r.id,
              value: r.ruteId.toString(),
              text: r.ruteName
            }))}
            onChange={handleMultiSelectChange}
          />
          {validationError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {validationError}
            </p>
          )}
          {ruteSelections.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rute yang dipilih ({ruteSelections.length}):
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {ruteSelections.map((rute, idx) => (
                  <li key={rute.id} className="flex items-center">
                    <span className="inline-block w-5 h-5 mr-2 text-center bg-blue-200 dark:bg-blue-800 rounded-full text-xs font-bold">
                      {idx + 1}
                    </span>
                    {rute.ruteName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div>
          <Label>Jenis Ritase</Label>
         <div className="relative">
           <Select
            options={jenisRitase}
            placeholder="Select Option"
            onChange={(value) => handleSelectChange(value, 'ritase')}
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
         </div>
         
        </div>

         
        
      </div>
    </ComponentCard>
  );
}
