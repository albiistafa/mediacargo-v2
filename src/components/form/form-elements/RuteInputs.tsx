"use client";
import React, { useState, useEffect } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/ui/alert/Alert';
import { useRute } from '@/hooks/useRute';

export default function RuteInputs() {

  const {
      rute,
      setRute,
      handleSubmit,
      loading,
      success,
      error,
      setSuccess
    } = useRute();

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
    setSuccess(false); // Reset success langsung setelah submit
  };

  return (
    <div>
      {showAlert && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-in fade-in slide-in-from-right-5 duration-300">
          {success && (
            <Alert
              variant="success"
              title="Berhasil"
              message="Rute berhasil ditambahkan"
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
      <ComponentCard title="Input Rute">
        <form onSubmit={handleFormSubmit}>
        <div className="space-y-6">
          
          <div>
            <Label>Input</Label>
            <Input 
            placeholder="Malang"
            id="rute"
            value={rute}
            required
            onChange={(e) => setRute(e.target.value)}
            type="text" />
          </div>
          <Button disabled={loading} 
          
          type="submit" className="w-full" size="sm">

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
                      ) : (
                        "Tambah Rute"
                      )}
          </Button>
          
        </div>
        </form>
      </ComponentCard>
    </div>
  );
}
