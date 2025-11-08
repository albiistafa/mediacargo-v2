import axiosInstance from "../lib/axios";
import { LoginResponse } from "../types/loginResponse";

//Login Function
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post<LoginResponse>('/admin/login', {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message );
    } else if (error.request) {
      throw new Error('Tidak dapat terhubung ke server');
    } else {
      throw new Error(error.message || 'Terjadi kesalahan');
    }
  }
}

//Get Profile Function
export async function getProfile() {
  try {
    const response = await axiosInstance.get('/admin/profile');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Gagal mengambil profile');
    }
    throw new Error('Terjadi kesalahan');
  }
}

