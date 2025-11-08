"use client";
import React, { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import { EnvelopeIcon } from '@/icons';
import { LockIcon} from '@/icons'
import Button from '@/components/ui/button/Button';

export default function AdminInput() {
  const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
  
    // Simulate a validation check
    const validateEmail = (value: string) => {
      const isValidEmail =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      setError(!isValidEmail);
      return isValidEmail;
    };
  
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEmail(value);
      validateEmail(value);
    };
  return (
    <ComponentCard title="">
      <div className="space-y-6">
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Input
              placeholder="info@gmail.com"
              type="text"
              className="pl-[62px]"
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
              placeholder=""
              type="text"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <LockIcon />
            </span>
          </div> 
        </div>
        
        <div>
          <Label>Konfirmasi Password</Label>
          <div className="relative">
            <Input
              placeholder=""
              type="text"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <LockIcon />
            </span>
          </div>    
        </div>  

        <div >
        <Button>
          Tambah Akun Admin
        </Button>
        </div>

        
      </div>
      
    </ComponentCard>
    
  );
}
