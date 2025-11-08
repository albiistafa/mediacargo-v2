"use client";
import { useState, useEffect } from "react";
import { getProfile } from "../../services/auth.services";
import { cacheProfile, getCachedProfile } from "../helpers/profileHelpers";

interface ProfileData {
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (forceRefresh: boolean = false) => {
    console.log("👤 useProfile: Fetching profile...");
    
    // Cek cache dulu jika tidak force refresh
    if (!forceRefresh) {
      const cached = getCachedProfile();
      if (cached) {
        console.log("✅ useProfile: Using cached profile");
        setProfile(cached.data);
        return cached.data;
      }
    }

    // Fetch dari API jika tidak ada cache atau force refresh
    setLoading(true);
    setError(null);

    try {
      console.log("🌐 useProfile: Fetching from API...");
      const response = await getProfile();
      const profileData = response?.data;

      if (profileData) {
        setProfile(profileData);
        cacheProfile(response); // Cache response lengkap
        console.log("✅ useProfile: Profile fetched & cached");
        return profileData;
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch profile";
      console.error("❌ useProfile error:", errorMsg);
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: () => fetchProfile(true), // Force refresh
    fetchProfile,
  };
}