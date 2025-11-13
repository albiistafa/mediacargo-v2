"use client";
import PageBreadcrumbInputData from "@/components/common/PageBreadCrumbInputData";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import DriverInputs from "@/components/form/form-elements/DriverInputs";
import SelectInputs from "@/components/form/form-elements/SelectInputs";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { useLaporan } from "@/hooks/useLaporan";
import React, { useState, useEffect } from "react";

export default function FormElements() {
  const { formData, ruteSelections, handleInputChange, handleRuteChange, loading, error, validationError, success, handleSubmit } = useLaporan();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (success || error) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const onFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e).then(() => {
      if (success) {
        setShowAlert(true);
      }
    });
  };

  return (
    <div>
      <PageBreadcrumbInputData pageTitle="Laporan" />
      
      {showAlert && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-in fade-in slide-in-from-right-5 duration-300">
          {success && (
            <Alert
              variant="success"
              title="Berhasil"
              message="Laporan berhasil ditambahkan"
            />
          )}
          {error && (
            <Alert
              variant="error"
              title="Error"
              message={error}
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <DefaultInputs formData={formData} onInputChange={handleInputChange as (field: string, value: any) => void} />
        <DriverInputs formData={formData} onInputChange={handleInputChange as (field: string, value: any) => void} />
        <SelectInputs 
          formData={formData} 
          ruteSelections={ruteSelections}
          onInputChange={handleInputChange as (field: string, value: any) => void}
          onRuteChange={handleRuteChange}
          validationError={validationError}
        />
        <TextAreaInput formData={formData} onInputChange={handleInputChange as (field: string, value: any) => void} />
        
        <div>
          <form onSubmit={onFormSubmit}>
            <Button 
              type="submit"
              disabled={loading}
              className={loading ? 'opacity-50 cursor-not-allowed w-full' : 'w-full'}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : 'Kirim'}
            </Button>
          </form>
        </div>
        
        <div className="space-y-6">
          
        </div>
        <div className="space-y-6">
          
          
        </div>
      </div>
    </div>
  );
}
