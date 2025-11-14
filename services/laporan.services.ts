import axiosInstance from "../lib/axios";
import { PostLaporanRequest, PostLaporanResponse } from "../types/laporan";

export interface RuteLaporan {
  id: number;
  laporan_id: number;
  rute_id: number;
  urutan: number;
  rute: {
    id: number;
    rute: string;
  };
}

export interface LaporanItem {
  id: number;
  ritase: string;
  trip: string;
  rute: string;
  driver: string;
  surat_jalan: string;
  no_seal: string;
  no_plat: string;
  ket_plat: string;
  mobil: string;
  keberangkatan: string;
  kedatangan: string;
  rate_before_tax: number;
  ppn_rate: number;
  pph_rate: number;
  rate_after_tax: number;
  keterangan: string;
  no_invoice: string;
  createdAt: string;
  updatedAt: string;
  ruteLaporan: RuteLaporan[];
}

export interface LaporanData{
  data: LaporanItem[];
  pagination: Array<any>;
}

export interface LaporanResponse {
  success: boolean;
  message: string;
  data: LaporanData;
}

export interface GetAllLaporanParams {
  page?: number;
  limit?: number;
  search?: string;
  field?: string;
}

/**
 * Get ALL laporan data without date range filter
 * Untuk menampilkan semua data tanpa batasan tanggal
 */
export const getAllLaporan = async (
  params?: GetAllLaporanParams
): Promise<LaporanResponse> => {
  try {
    const queryParams = new URLSearchParams();

    // Jika tidak ada page/limit dari frontend, pakai nilai override
    queryParams.append('page', String(params?.page || 1));
    queryParams.append('limit', String(params?.limit || 999999)); 

    if (params?.search) {
      queryParams.append('search', params.search);
      queryParams.append('field', params.field || 'rute');
    }

    const response = await axiosInstance.get<LaporanResponse>(
      `/laporan/?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching all laporan:", error);
    throw error;
  }
};

export interface GetLaporanParams {
  startDate: string; // ISO format date
  endDate: string; // ISO format date
  search?: string;
  field?: string;
  page?: number;
  limit?: number;
}

/**
 * Get laporan data with date range filter
 */
export const getLaporan = async (params: GetLaporanParams): Promise<LaporanResponse> => {
  try {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
      search: params.search || "",
      field: params.field || "",
      page: String(params.page || 1),
      limit: String(params.limit || 10),
    });

    const response = await axiosInstance.get<LaporanResponse>(
      `/laporan?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching laporan:", error);
    throw error;
  }
};

/**
 * Format date to ISO string with timezone offset
 * @param date - Date object
 * @param isEndOfDay - If true, set time to 23:59:59, otherwise 00:00:00
 */
export const formatDateForAPI = (date: Date, isEndOfDay = false): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const time = isEndOfDay ? '23:59:59' : '00:00:00';
  const timezone = '+08:00'; // WIB timezone
  
  return `${year}-${month}-${day}T${time}${timezone}`;
};

/**
 * Format ruteLaporan array to string "Rute A - Rute B"
 */
export const formatRuteLaporan = (ruteLaporan: RuteLaporan[]): string => {
  return ruteLaporan
    .sort((a, b) => a.urutan - b.urutan)
    .map(item => item.rute.rute)
    .join(' - '); 
};

/**
 * Format date time for display
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};;

// -------- Invoice (Export PDF) --------

export interface InvoicePayload {
  tipe: string; // e.g. "UTAMA" | "CABANG"
  company: string;
  contactPerson: string;
  address: string;
  startDate: string; // ISO with timezone, e.g. 2025-10-09T00:00:00+08:00
  endDate: string;   // ISO with timezone, e.g. 2025-10-10T23:59:59+08:00
}

/**
 * Call invoice API and return a Blob (PDF)
 */
export const exportInvoice = async (payload: InvoicePayload): Promise<Blob> => {
  const res = await axiosInstance.post<Blob>(`/invoice`, payload, {
    responseType: 'blob',
  });
  // Axios with responseType 'blob' returns data as Blob
  // @ts-ignore - axios typing for blob generic
  return res.data as Blob;
};

/**
 * Post laporan data
 */
export const postLaporan = async (data: PostLaporanRequest): Promise<PostLaporanResponse> => {
  try {
    const response = await axiosInstance.post<PostLaporanResponse>('/laporan', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Gagal menambahkan laporan');
    } else if (error.request) {
      throw new Error('Tidak dapat terhubung ke server');
    } else {
      throw new Error(error.message || 'Terjadi kesalahan');
    }
  }
};

/**
 * Delete laporan data
 */
export const deleteLaporan = async (id: number): Promise<PostLaporanResponse> => {
  try {
    console.log(`[deleteLaporan] Attempting to delete laporan with ID: ${id}`);
    
    const response = await axiosInstance.delete<PostLaporanResponse>(`/laporan/${id}`);
    console.log(`[deleteLaporan] Success response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error("[deleteLaporan] Full error object:", error);
    
    if (error.response) {
      // Server responded with error status
      console.error("[deleteLaporan] Error response status:", error.response.status);
      console.error("[deleteLaporan] Error response data:", error.response.data);
      
      if (error.response.status === 404) {
        console.warn("[deleteLaporan] Got 404 - endpoint might not exist or route not matched");
        throw new Error(`Laporan dengan ID ${id} tidak ditemukan atau endpoint tidak tersedia`);
      }
      
      if (error.response.status === 405) {
        throw new Error('Method DELETE tidak di-support untuk endpoint ini');
      }
      
      // Try to extract message from various response formats
      let message = 'Gagal menghapus laporan';
      
      if (error.response.data?.message) {
        message = error.response.data.message;
      } else if (typeof error.response.data === 'string') {
        message = error.response.data;
      }
      
      throw new Error(`${message} (Status: ${error.response.status})`);
    } else if (error.request) {
      // Request made but no response
      console.error("[deleteLaporan] Error request:", error.request);
      throw new Error('Tidak dapat terhubung ke server');
    } else {
      // Other errors
      console.error("[deleteLaporan] Error message:", error.message);
      throw new Error(error.message || 'Terjadi kesalahan');
    }
  }
};
