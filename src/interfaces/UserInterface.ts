export interface NewUser {
  given_name: string;
  family_name: string;
  email_address: string;
  phone_number?: string;
}

export interface UserStatus {
  new_customer: boolean;
}