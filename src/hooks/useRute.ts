"use client";

import { useState } from "react";
import { postRute } from "../../services/rute.services";

export function useRute(){
    const [rute, setRute] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
    
            setLoading(true);
            setError(null);
            setSuccess(false);
    
            try {
                const data = await postRute(rute);
                setSuccess(true);

            } catch (err) {
                setError("Email atau password salah.");
            } finally {
                setLoading(false);
                setSuccess(false);
            }
        };

    return {
        rute,
        setRute,
        loading,
        error,
        success,
        handleSubmit,
    };    

}
