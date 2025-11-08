"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../services/auth.services";
import { getProfile } from "../../services/auth.services";
import { setToken } from "../helpers/authHelpers";
import { cacheProfile, getCachedProfile } from "../helpers/profileHelpers";

export function useLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const data = await login(email, password);

            const token = data?.data?.token;

            if (!token) {
                setError("Terjadi kesalahan saat login.");
                return;
            }

            // Simpan token ke cookies (1 hari)
            setToken(token, 1);
            setSuccess(true);

            const profileData = await getProfile();
            cacheProfile(profileData);

            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 800);
        } catch (err) {
            setError("Email atau password salah.");
        } finally {
            setLoading(false);
           
        }
    };


    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        success,
        handleSubmit,
    };
}