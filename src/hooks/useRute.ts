"use client";

import { useState } from "react";
import { postRute, getRute } from "../../services/rute.services";
import { Rute } from "../../types/rute";

export function useRute(){
    const [rute, setRute] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [ruteList, setRuteList] = useState<Rute[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
    
            setLoading(true);
            setError(null);
            setSuccess(false);
    
            try {
                const data = await postRute(rute);
                setSuccess(true);
                setRute(""); // Reset form jika berhasil
            } catch (err: any) {
                setError(err.message || "Gagal menambahkan rute");
            } finally {
                setLoading(false);
                // Jangan reset success di sini, biarkan RuteInputs handle
            }
        };

    const fetchRute = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const data = await getRute();
                setRuteList(data.data);
            } catch (err: any) {
                setError(err.message || 'Gagal mengambil data rute');
            } finally {
                setLoading(false);
            }
        };

    return {
        rute,
        setRute,
        loading,
        error,
        success,
        setSuccess,
        handleSubmit,
        ruteList,
        fetchRute,
    };    

}
