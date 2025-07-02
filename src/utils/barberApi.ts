import { AvailabilityRequest, AvailabilityResponse, BarberDetailResponse, BarberResponse, BookingRequest, BookingResponse, CreateRecordInput, CustomerDetail, CustomerRequest, CustomerResponse, ServicesResponse } from '@/interfaces/BookingInterface';
import { apiClient } from './apiClients';
import { AxiosResponse } from 'axios';
import { CustomerStatus } from '@/interfaces/UserInterface';

// Square endpoints (public - no auth required)
export const getAllService = async (filter?: string, type?: string): Promise<ServicesResponse> => {
  const params = new URLSearchParams();
  if (filter) params.append('filter', filter);
  if (type) params.append('type', type);
  
  const response: AxiosResponse<ServicesResponse> = await apiClient.get(`/services${params.toString() ? '?' + params.toString() : ''}`);
  return response.data;
};

export const getAllBarber = async (): Promise<BarberResponse> => {
  const response: AxiosResponse<BarberResponse> = await apiClient.get('/barbers');
  return response.data;
};

export const getBarberDetail = async (barber_id: string): Promise<BarberDetailResponse> => {
  const response: AxiosResponse<BarberDetailResponse> = await apiClient.get(`/barbers/${barber_id}`);
  return response.data;
};

export const getAvailability = async (data: AvailabilityRequest): Promise<AvailabilityResponse> => {
  const response: AxiosResponse<AvailabilityResponse> = await apiClient.post('/availability', data);
  return response.data;
};

// Booking endpoints (require authentication)
export const postBooking = async (data: BookingRequest, bookFrom: string): Promise<BookingResponse> => {
  const response: AxiosResponse<BookingResponse> = await apiClient.post(`/bookings?source=${bookFrom}`, data);
  return response.data;
};

// Customer endpoints - NOT IMPLEMENTED IN BACKEND YET
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCustomerStatusByEmailAndPhone = async (email: string, phone: string): Promise<CustomerStatus> => {
  // This endpoint doesn't exist in the new API yet
  // For now, return a mock response
  console.warn('getCustomerStatusByEmailAndPhone is not implemented in the new API');
  return { new_customer: true };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCustomerByEmailAndPhone = async (email: string, phone: string): Promise<CustomerDetail> => {
  // This endpoint doesn't exist in the new API yet
  // For now, return null to indicate customer not found
  console.warn('getCustomerByEmailAndPhone is not implemented in the new API');
  return null as unknown as CustomerDetail;
};

// Legacy endpoints - these might need to be updated based on new API structure
export const postCustomer = async (data: CustomerRequest): Promise<CustomerResponse> => {
  // This functionality is now handled by the auth/register endpoint
  // For now, return a mock response to maintain compatibility
  console.warn('postCustomer should be replaced with proper auth/register flow');
  
  return {
    customer: {
      id: 'temp-' + Date.now(),
      given_name: data.given_name,
      family_name: data.family_name,
      email_address: data.email_address,
      phone_number: data.phone_number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      preferences: { email_unsubscribed: false },
      creation_source: 'WEB',
      version: 1
    }
  };
};

export const postUtmRecord = async (data: CreateRecordInput): Promise<CreateRecordInput> => {
  // This endpoint doesn't exist in the new API
  // You might need to implement this in the backend or remove this functionality
  console.warn('postUtmRecord is not implemented in the new API');
  return data;
};