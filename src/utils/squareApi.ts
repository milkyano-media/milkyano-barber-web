import { AvailabilityRequest, AvailabilityResponse, BarberDetailResponse, BarberResponse, BookingRequest, BookingResponse, CustomerRequest, CustomerResponse, ServicesResponse } from '@/interfaces/BookingInterface';
import { apiSquare } from './apiClients';
import { AxiosResponse } from 'axios';
import { UserStatus } from '@/interfaces/UserInterface';


export const getServices = async (filter: string, type: string): Promise<ServicesResponse> => {
  const response: AxiosResponse<ServicesResponse> = await apiSquare.get(`/squareup/services?filter=${filter}&type=${type}`);
  return response.data;
};

export const getBarbers = async (): Promise<BarberResponse> => {
  const response: AxiosResponse<BarberResponse> = await apiSquare.get('/squareup/barbers');
  return response.data;
};

export const getBarberDetail = async (barber_id: string): Promise<BarberDetailResponse> => {
  const response: AxiosResponse<BarberDetailResponse> = await apiSquare.get(`/squareup/barbers/detail?barber_id=${barber_id}`);
  return response.data;
};

export const getAvailability = async (data: AvailabilityRequest): Promise<AvailabilityResponse> => {
  const response: AxiosResponse<AvailabilityResponse> = await apiSquare.post('/squareup/availability', data);
  return response.data;
};

export const createCustomer = async (data: CustomerRequest): Promise<CustomerResponse> => {
  const response: AxiosResponse<CustomerResponse> = await apiSquare.post('/squareup/customers', data);
  return response.data;
};

export const createBooking = async (data: BookingRequest): Promise<BookingResponse> => {
  const response: AxiosResponse<BookingResponse> = await apiSquare.post('/squareup/bookings', data);
  return response.data;
};

export const checkUserStatus = async (data: CustomerRequest): Promise<UserStatus> => {
  const response: AxiosResponse<UserStatus> = await apiSquare.post('/users/status', data);
  return response.data;
};

