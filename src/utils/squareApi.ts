import { apiSquare } from './apiClients';
import { AxiosResponse } from 'axios';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
  };
}

interface RegisterRequest {
  username: string;
  password: string;
  name: string;
}

interface RegisterResponse {
  id: string;
  username: string;
  name: string;
}

interface UserProfileResponse {
  id: string;
  username: string;
  name: string;
  email: string;
  created_at: string;
}

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const loginClient1 = async (data: LoginRequest): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await apiSquare.post('/auth/login', data);
  return response.data;
};

export const registerClient1 = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response: AxiosResponse<RegisterResponse> = await apiSquare.post('/auth/register', data);
  return response.data;
};

export const getUserProfileClient1 = async (userId: string): Promise<UserProfileResponse> => {
  const response: AxiosResponse<UserProfileResponse> = await apiSquare.get(`/users/${userId}`);
  return response.data;
};

export const getItemsClient1 = async (): Promise<Item[]> => {
  const response: AxiosResponse<Item[]> = await apiSquare.get('/items');
  return response.data;
};

