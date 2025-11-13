export interface RegisterAdminRequest {
  name: string;
  email: string;
  password: string;
}

export interface AdminData {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface RegisterAdminResponse {
  success: boolean;
  message: string;
  data: AdminData;
}
