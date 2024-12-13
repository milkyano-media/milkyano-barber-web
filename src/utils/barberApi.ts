import { AvailabilityRequest, AvailabilityResponse, BarberDetailResponse, BarberResponse, BookingRequest, BookingResponse, CreateRecordInput, CustomerDetail, CustomerRequest, CustomerResponse, ServicesResponse } from '@/interfaces/BookingInterface';
import { apiSquare } from './apiClients';
import { AxiosResponse } from 'axios';
import { CustomerStatus } from '@/interfaces/UserInterface';


export const getAllService = async (filter: string, type: string): Promise<ServicesResponse> => {
  const response: AxiosResponse<ServicesResponse> = await apiSquare.get(`/web/squareup/service/list?filter=${filter}&type=${type}`);
  return response.data;
};

export const getAllBarber = async (): Promise<BarberResponse> => {
  const response: AxiosResponse<BarberResponse> = await apiSquare.get('/web/squareup/barber/list');
  return response.data;
};

export const getBarberDetail = async (barber_id: string): Promise<BarberDetailResponse> => {
  const response: AxiosResponse<BarberDetailResponse> = await apiSquare.get(`/web/squareup/barber/detail?barber_id=${barber_id}`);
  return response.data;
};

export const getAvailability = async (data: AvailabilityRequest): Promise<AvailabilityResponse> => {
  const response: AxiosResponse<AvailabilityResponse> = await apiSquare.post('/web/squareup/availability', data);
  return response.data;
};

export const postCustomer = async (data: CustomerRequest): Promise<CustomerResponse> => {
  const response: AxiosResponse<CustomerResponse> = await apiSquare.post('/web/squareup/customer', data);
  return response.data;
};

export const postBooking = async (data: BookingRequest, bookFrom: string): Promise<BookingResponse> => {
  const response: AxiosResponse<BookingResponse> = await apiSquare.post(`/web/squareup/booking?source=${bookFrom}`, data);
  return response.data;
};

export const getCustomerStatusByEmailAndPhone = async (email: string, phone: string): Promise<CustomerStatus> => {
  const response: AxiosResponse<CustomerStatus> = await apiSquare.get(`/web/customer/status?email=${email}&phone=${phone}`);
  return response.data;
};

export const getCustomerByEmailAndPhone = async (email: string, phone: string): Promise<CustomerDetail> => {
  const response: AxiosResponse<CustomerDetail> = await apiSquare.get(`/web/customer?email=${email}&phone=${phone}`);
  return response.data;
};

export const postUtmRecord = async (data: CreateRecordInput): Promise<CreateRecordInput> => {
  const response: AxiosResponse<CreateRecordInput> = await apiSquare.post('/dash/record', data);
  return response.data;
};

