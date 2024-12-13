export interface NewCustomer {
  given_name: string;
  family_name: string;
  email_address: string;
  phone_number?: string;
}

export interface CustomerStatus {
  new_customer: boolean;
}