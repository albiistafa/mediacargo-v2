"use client";
import React, { useState, useEffect } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import { EnvelopeIcon } from '@/icons';
import { LockIcon, EyeIcon, EyeCloseIcon } from '@/icons'
import Button from '@/components/ui/button/Button';
import Alert from '@/components/ui/alert/Alert';
import { useAdmin } from '@/hooks/useAdmin';

export default function AdminInput() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    success,
    setSuccess,
    validationError,
    handleSubmit,
    resetForm,
  } = useAdmin();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (success || error) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, setSuccess]);

  const onFormSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
  };

  return (
    <>
      {showAlert && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-in fade-in slide-in-from-right-5 duration-300">
          {success && (
            <Alert
              variant="success"
              title="Berhasil"
              message="Admin berhasil didaftarkan"
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

      <ComponentCard title="">
        <div className="space-y-6">
          {validationError && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {validationError}
            </div>
          )}

        <div>
          <Label>Nama</Label>
          <div className="relative">
            <Input
              placeholder="Admin"
              type="text"
              className="pl-[62px]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <EnvelopeIcon />
            </span>
          </div>
        </div>

        <div>
          <Label>Email</Label>
          <div className="relative">
            <Input
              placeholder="info@gmail.com"
              type="email"
              className="pl-[62px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <EnvelopeIcon />
            </span>
          </div>
        </div>

        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              placeholder="••••••"
              type={showPassword ? "text" : "password"}
              className="pl-[62px] pr-[62px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <LockIcon />
            </span>
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 border-l border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeCloseIcon /> : <EyeIcon />}
            </button>
          </div> 
        </div>
        
        <div>
          <Label>Konfirmasi Password</Label>
          <div className="relative">
            <Input
              placeholder="••••••"
              type={showConfirmPassword ? "text" : "password"}
              className="pl-[62px] pr-[62px]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <LockIcon />
            </span>
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 border-l border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeCloseIcon /> : <EyeIcon />}
            </button>
          </div>    
        </div>  

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
              ) : 'Tambah Akun Admin'}
            </Button>
          </form>
        </div>
      </div>
    </ComponentCard>
    </>
  );
}
