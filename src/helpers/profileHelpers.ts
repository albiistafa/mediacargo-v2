// src/lib/helpers/profileHelpers.ts

const PROFILE_CACHE_KEY = "user_profile";
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit dalam milliseconds

interface CachedProfile {
  data: any;
  timestamp: number;
}

// Simpan profile ke localStorage dengan timestamp
export const cacheProfile = (profileData: any) => {
  try {
    const cached: CachedProfile = {
      data: profileData,
      timestamp: Date.now(),
    };
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cached));
    console.log("✅ Profile cached to localStorage");
  } catch (error) {
    console.error("❌ Failed to cache profile:", error);
  }
};

// Ambil profile dari localStorage jika masih valid
export const getCachedProfile = (): any | null => {
  try {
    const cached = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!cached) {
      console.log("📭 No cached profile found");
      return null;
    }

    const parsed: CachedProfile = JSON.parse(cached);
    const now = Date.now();
    const age = now - parsed.timestamp;

    // Cek apakah cache masih valid (belum expired)
    if (age < CACHE_DURATION) {
      console.log(`✅ Using cached profile (age: ${Math.round(age / 1000)}s)`);
      return parsed.data;
    } else {
      console.log("⏰ Cache expired, need fresh data");
      clearProfileCache();
      return null;
    }
  } catch (error) {
    console.error("❌ Failed to get cached profile:", error);
    return null;
  }
};

// Hapus cache profile (untuk logout)
export const clearProfileCache = () => {
  try {
    localStorage.removeItem(PROFILE_CACHE_KEY);
    console.log("🗑️ Profile cache cleared");
  } catch (error) {
    console.error("❌ Failed to clear profile cache:", error);
  }
};

// Cek apakah cache masih valid
export const isProfileCacheValid = (): boolean => {
  try {
    const cached = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!cached) return false;

    const parsed: CachedProfile = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;
    return age < CACHE_DURATION;
  } catch (error) {
    return false;
  }
};