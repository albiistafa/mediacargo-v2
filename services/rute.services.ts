import axiosInstance from "../lib/axios";
import { AddRuteResponse } from "../types/AddRuteResponse";

export async function postRute(rute: string): Promise<AddRuteResponse> {
  try {
    const response = await axiosInstance.post<AddRuteResponse>('/rute', {
      rute
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Gagal menambahkan rute');
    } else if (error.request) {
      throw new Error('Tidak dapat terhubung ke server');
    } else {
      throw new Error(error.message || 'Terjadi kesalahan');
    }
  }
}
