import axiosInstance from "../lib/axios";
import { RegisterAdminRequest, RegisterAdminResponse } from "../types/admin";

export const registerAdmin = async (
  data: RegisterAdminRequest
): Promise<RegisterAdminResponse> => {
  try {
    const response = await axiosInstance.post<RegisterAdminResponse>(
      "/admin/register",
      data
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Gagal mendaftarkan admin";
    throw new Error(errorMessage);
  }
};
