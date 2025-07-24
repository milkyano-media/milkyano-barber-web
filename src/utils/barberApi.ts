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

// Customer endpoints
export const getCustomerStatusByEmailAndPhone = async (email: string, phone: string): Promise<CustomerStatus> => {
  const params = new URLSearchParams({ email, phone });
  const response: AxiosResponse<CustomerStatus> = await apiClient.get(`/customers/status?${params.toString()}`);
  return response.data;
};

export const getCustomerByEmailAndPhone = async (email: string, phone: string): Promise<CustomerDetail> => {
  try {
    const params = new URLSearchParams({ email, phone });
    const response: AxiosResponse<{ customer: CustomerDetail }> = await apiClient.get(`/customers/search?${params.toString()}`);
    return response.data.customer;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null as unknown as CustomerDetail;
    }
    throw error;
  }
};

export const postCustomer = async (data: CustomerRequest): Promise<CustomerResponse> => {
  const response: AxiosResponse<CustomerResponse> = await apiClient.post('/customers', data);
  return response.data;
};

export const postUtmRecord = async (data: CreateRecordInput): Promise<CreateRecordInput> => {
  // This endpoint doesn't exist in the new API
  // You might need to implement this in the backend or remove this functionality
  console.warn('postUtmRecord is not implemented in the new API');
  return data;
};

// Booking management endpoints (require authentication)
export const cancelBooking = async (bookingId: string, bookingVersion: number): Promise<any> => {
  const response = await apiClient.post(`/bookings/${bookingId}/cancel`, {
    bookingVersion
  });
  return response.data;
};

export const rescheduleBooking = async (
  bookingId: string, 
  rescheduleData: {
    start_at: string;
    appointment_segments?: any[];
  }
): Promise<any> => {
  const response = await apiClient.put(`/bookings/${bookingId}/reschedule`, rescheduleData);
  return response.data;
};

export const getBookingDetails = async (bookingId: string): Promise<any> => {
  const response = await apiClient.get(`/bookings/${bookingId}`);
  return response.data;
};