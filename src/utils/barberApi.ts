import {
    AvailabilityRequest,
    AvailabilityResponse,
    BarberDetailResponse,
    BarberResponse,
    BookingRequest,
    BookingResponse,
    CreateRecordInput,
    CustomerDetail,
    CustomerRequest,
    CustomerResponse,
    ServicesResponse,
} from "@/interfaces/BookingInterface";
import { apiClient } from "./apiClients";
import { AxiosResponse } from "axios";
import { CustomerStatus } from "@/interfaces/UserInterface";

// Square endpoints (public - no auth required)
export const getAllService = async (filter?: string, type?: string): Promise<ServicesResponse> => {
    const params = new URLSearchParams();
    if (filter) params.append("filter", filter);
    if (type) params.append("type", type);

    const response: AxiosResponse<ServicesResponse> = await apiClient.get(
        `/services${params.toString() ? "?" + params.toString() : ""}`
    );
    return response.data;
};

export const getAllBarber = async (): Promise<BarberResponse> => {
    const response: AxiosResponse<BarberResponse> = await apiClient.get("/barbers");
    return response.data;
};

export const getBarberDetail = async (barber_id: string): Promise<BarberDetailResponse> => {
    const response: AxiosResponse<BarberDetailResponse> = await apiClient.get(`/barbers/${barber_id}`);
    return response.data;
};

export const getAvailability = async (data: AvailabilityRequest): Promise<AvailabilityResponse> => {
    const response: AxiosResponse<AvailabilityResponse> = await apiClient.post("/availability", data);
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
        const response: AxiosResponse<{ customer: CustomerDetail }> = await apiClient.get(
            `/customers/search?${params.toString()}`
        );
        return response.data.customer;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null as unknown as CustomerDetail;
        }
        throw error;
    }
};

export const postCustomer = async (data: CustomerRequest): Promise<CustomerResponse> => {
    const response: AxiosResponse<CustomerResponse> = await apiClient.post("/customers", data);
    return response.data;
};

export const postUtmRecord = async (data: CreateRecordInput): Promise<CreateRecordInput> => {
    // This endpoint doesn't exist in the new API
    // You might need to implement this in the backend or remove this functionality
    console.warn("postUtmRecord is not implemented in the new API");
    return data;
};

// Booking management endpoints (require authentication)
export const cancelBooking = async (bookingId: string, bookingVersion: number): Promise<any> => {
    const response = await apiClient.post(`/bookings/${bookingId}/cancel`, {
        bookingVersion,
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

// ========== NEW BARBER MANAGEMENT APIs (Admin only) ==========
import type { Barber, CreateBarberDto, UpdateBarberDto, ReorderBarberDto } from "../interfaces/BarberInterface";

const BARBER_MANAGEMENT_BASE = "/barber-management";

/**
 * Get all barbers with optional active filter (public)
 */
export async function getBarbersManagement(isActive?: boolean): Promise<Barber[]> {
    const params = isActive !== undefined ? { isActive } : {};
    const response = await apiClient.get<{ barbers: Barber[] }>(BARBER_MANAGEMENT_BASE, { params });
    return response.data.barbers;
}

/**
 * Get a single barber by ID (public)
 */
export async function getBarberByIdManagement(id: string): Promise<Barber> {
    const response = await apiClient.get<Barber>(`${BARBER_MANAGEMENT_BASE}/${id}`);
    return response.data;
}

/**
 * Create a new barber (admin only)
 */
export async function createBarberManagement(data: CreateBarberDto): Promise<Barber> {
    const response = await apiClient.post<Barber>(BARBER_MANAGEMENT_BASE, data);
    return response.data;
}

/**
 * Update an existing barber (admin only)
 */
export async function updateBarberManagement(id: string, data: UpdateBarberDto): Promise<Barber> {
    const response = await apiClient.patch<Barber>(`${BARBER_MANAGEMENT_BASE}/${id}`, data);
    return response.data;
}

/**
 * Delete a barber (admin only)
 */
export async function deleteBarberManagement(id: string): Promise<void> {
    await apiClient.delete(`${BARBER_MANAGEMENT_BASE}/${id}`);
}

/**
 * Reorder barbers (admin only)
 */
export async function reorderBarbersManagement(updates: ReorderBarberDto[]): Promise<void> {
    await apiClient.patch(`${BARBER_MANAGEMENT_BASE}/reorder`, { updates });
}

/**
 * Convert a file to base64 data URL
 */
export function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result);
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: "Invalid file type. Please upload PNG, JPG, JPEG, or WebP image.",
        };
    }

    // Check file size (max 2MB)
    console.log(file.size);
    const maxSize = 2 * 1024 * 512; // 1MB
    if (file.size > maxSize) {
        return {
            valid: false,
            error: "File size exceeds 1.5MB. Please upload a smaller image.",
        };
    }

    return { valid: true };
}
