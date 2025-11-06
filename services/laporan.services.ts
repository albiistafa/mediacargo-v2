import axiosInstance from "../lib/axios";

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

export interface LaporanResponse {
  success: boolean;
  message: string;
  data: LaporanItem[];
}

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
      search: params.search || "utama",
      field: params.field || "rute",
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
