import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_NEW_API as string
});

interface UserRequest {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
}

interface VisitRequest {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    fbclid?: string;
}

interface CustomerRequest {
    square_customer_id: string;
    user: UserRequest;
    visit: VisitRequest;
}

interface CustomerResponse {
    id: number;
    square_customer_id: string;
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        created_at: string;
        updated_at: string;
    };
    first_visit: string;
    last_visit: string;
    transaction_count: number;
    total_spend: number;
    memo: string | null;
    email_subscription_status: string;
    is_instant_profile: boolean;
    ads_influence_score: number;
    created_at: string;
    updated_at: string;
}

interface ApiResponse<T> {
    data: T;
    message: string;
    status: string;
}

export const registerCustomer = async (
    squareCustomerId: string,
    values: { 
        email_address: string;
        given_name: string;
        family_name: string;
        phone_number: string;
    }
): Promise<ApiResponse<CustomerResponse>> => {
    try {
        const requestData: CustomerRequest = {
            square_customer_id: squareCustomerId,
            user: {
                email: values.email_address,
                first_name: values.given_name,
                last_name: values.family_name,
                phone_number: values.phone_number
            },
            visit: {
                utm_source: localStorage.getItem('utm_source') || undefined,
                utm_medium: localStorage.getItem('utm_medium') || undefined,
                utm_campaign: localStorage.getItem('utm_campaign') || undefined,
                utm_content: localStorage.getItem('utm_content') || undefined,
                fbclid: localStorage.getItem('fbclid') || undefined
            }
        };

        const response = await api.post<ApiResponse<CustomerResponse>>(
            'customers',
            requestData
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                throw new Error('Customer not found');
            }
            if (error.response?.status === 400) {
                throw new Error(error.response.data.message || 'Invalid request data');
            }
            if (error.response?.status === 409) {
                throw new Error('Customer already exists');
            }
            throw new Error(error.response?.data.message || 'Failed to register customer');
        }
        throw new Error('An unexpected error occurred');
    }
};

export const checkCustomerExists = async (
    criteria: {
        type: 'email' | 'phone_number' | 'square_customer_id';
        value: string;
    }
): Promise<ApiResponse<CustomerResponse>> => {
    try {
        const response = await api.get<ApiResponse<CustomerResponse>>(
            `customers/search?type=${criteria.type}&value=${criteria.value}`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            throw new Error('Customer not found');
        }
        throw error;
    }
};