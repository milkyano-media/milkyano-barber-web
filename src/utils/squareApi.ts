import { BarberResponse, ServicesResponse } from '@/interfaces/BookingInterface';
import { apiSquare } from './apiClients';
import { AxiosResponse } from 'axios';


export const getServices = async (filter: string, type: string): Promise<ServicesResponse> => {
  const response: AxiosResponse<ServicesResponse> = await apiSquare.get(`/squareup/services?filter=${filter}&type=${type}`);
  return response.data;
};

export const getBarbers = async (): Promise<BarberResponse> => {
  const response: AxiosResponse<BarberResponse> = await apiSquare.get('/squareup/barbers');
  return response.data;
};

