"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import Input from '../input/InputField';
import MultiSelect from "../MultiSelect";
import { ChevronDownIcon } from "@/icons";

export default function SelectInputs() {
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

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  const multiOptions = [
    { value: "1", text: "Option 1", selected: false },
    { value: "2", text: "Option 2", selected: false },
    { value: "3", text: "Option 3", selected: false },
    { value: "4", text: "Option 4", selected: false },
    { value: "5", text: "Option 5", selected: false },
  ];

  return (
    <ComponentCard title="Input Rute">
      <div className="space-y-6">
        {/* <div>
          <Label>Input</Label>
          <Input type="text" />
        </div> */}
        <div>
          <Label>Jenis Trip</Label>
         <div className="relative">
           <Select
            options={jenisTrip}
            placeholder="Select Option"
            onChange={handleSelectChange}
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
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
         </div>
         
        </div>

        <div className="relative">
          <MultiSelect
            label="Input Rute"
            options={multiOptions}
            defaultSelected={["1", "3"]}
            onChange={(values) => setSelectedValues(values)}
          />
          <p className="sr-only">
            Selected Values: {selectedValues.join(", ")}
          </p>
        </div>
        
        <div>
          <Label>Jenis Ritase</Label>
         <div className="relative">
           <Select
            options={jenisRitase}
            placeholder="Select Option"
            onChange={handleSelectChange}
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
