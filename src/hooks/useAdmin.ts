"use client";

import { useState } from "react";
import { registerAdmin } from "../../services/admin.services";

export function useAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    setValidationError(null);

    if (!name.trim()) {
      setValidationError("Nama harus diisi");
      return false;
    }

    if (!email.trim()) {
      setValidationError("Email harus diisi");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Format email tidak valid");
      return false;
    }

    if (!password) {
      setValidationError("Password harus diisi");
      return false;
    }

    if (password.length < 6) {
      setValidationError("Password minimal 6 karakter");
      return false;
    }

    if (!confirmPassword) {
      setValidationError("Konfirmasi password harus diisi");
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError("Password dan konfirmasi password tidak sama");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await registerAdmin({
        name,
        email,
        password,
      });

      setSuccess(true);
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Gagal mendaftarkan admin");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(false);
    setValidationError(null);
  };

  return {
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
  };
}
