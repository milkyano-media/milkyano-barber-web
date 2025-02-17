export interface CustomerCreateRequest {
    square_customer_id: string;
    user: {
        email: string;
        first_name: string;
        last_name: string;
        phone_number: string;
    };
    visit: {
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
        utm_content?: string;
        fbclid?: string;
    };
}