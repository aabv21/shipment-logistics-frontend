import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      role: string;
      first_name: string;
      last_name: string;
      phone: string;
    };
    token: string;
  };
}

export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/users/login`,
      credentials
    );
    return response.data;
  },

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/users/register`,
      userData
    );
    return response.data;
  },
};
