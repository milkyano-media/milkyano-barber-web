/* eslint-disable @typescript-eslint/no-explicit-any */
interface BarberProfile {
  team_member_id: string;
  display_name: string;
  is_bookable: boolean;
}

interface BarberResponse {
  team_member_booking_profiles: BarberProfile[];
  errors?: unknown[];
}
interface ServicesVariation {
  type: string;
  id: string;
  updated_at: string;
  created_at: string;
  version: number;
  is_deleted: boolean;
  present_at_all_locations: boolean;
  item_variation_data: {
    item_id: string;
    name: string;
    ordinal: number;
    pricing_type: string;
    price_money: {
      amount: number;
      currency: string;
    };
    service_duration: number;
    price_description: string;
    available_for_booking: boolean;
    sellable: boolean;
    stockable: boolean;
    team_member_ids: string[];
    channels?: string[];
  };
}

interface ServicesItem {
  type: string;
  id: string;
  updated_at: string;
  created_at: string;
  version: number;
  is_deleted: boolean;
  present_at_all_locations: boolean;
  item_data: {
    name: string;
    label_color?: string;
    is_taxable: boolean;
    visibility: string;
    tax_ids: string[];
    variations: ServicesVariation[];
    product_type: string;
    skip_modifier_screen: boolean;
    ecom_visibility: string;
    categories: {
      id: string;
      ordinal: number;
    }[];
    location_overrides?: {
      location_id: string;
      ordinal: number;
    }[];
    is_archived: boolean;
    reporting_category: {
      id: string;
      ordinal: number;
    };
    channels: string[];
  };
}

interface ServicesResponse {
  items: ServicesItem[];
  cursor: string;
  matched_variation_ids: string[];
}

interface CancellationFeeMoney {
  currency: string;
}

interface BusinessAppointmentSettings {
  location_types: string[];
  alignment_time: string;
  min_booking_lead_time_seconds: number;
  max_booking_lead_time_seconds: number;
  any_team_member_booking_enabled: boolean;
  multiple_service_booking_enabled: boolean;
  cancellation_fee_money: CancellationFeeMoney;
  cancellation_policy: string;
  skip_booking_flow_staff_selection: boolean;
}

interface CustomerRequest {
  given_name: string;
  family_name: string;
  email_address: string;
  phone_number: string;
  idempotency_key: string;
}

interface CustomerResponse {
  customer: {
    id: string;
    created_at: string;
    updated_at: string;
    given_name: string;
    family_name: string;
    email_address: string;
    phone_number: string;
    preferences: {
      email_unsubscribed: boolean;
    };
    creation_source: string;
    version: number;
  };
}

interface BusinessBookingProfile {
  seller_id: string;
  created_at: string;
  booking_enabled: boolean;
  customer_timezone_choice: string;
  booking_policy: string;
  allow_user_cancel: boolean;
  business_appointment_settings: BusinessAppointmentSettings;
}


interface BusinessBookingProfileResponse {
  business_booking_profile: BusinessBookingProfile;
  errors?: unknown[];
}

interface AvailabilityRequest {
  service_variation_id: string,
  start_at: string,
  end_at: string
}

interface AvailabilityQuery {
  query: {
    filter: {
      start_at_range: {
        start_at: string;
        end_at: string;
      };
      segment_filters: Array<{
        service_variation_id: string;
      }>;
      location_id: string;
    };
  };
}
interface AppointmentSegment {
  duration_minutes: number;
  team_member_id: string;
  service_variation_id: string;
  service_variation_version: number;
}
interface Availability {
  start_at: string;
  location_id: string;
  appointment_segments: AppointmentSegment[];
}
interface AvailabilityResponse {
  availabilities: Availability[];
  errors?: unknown[];
}

interface BookingRequest {
  booking: {
    customer_id: string;
    appointment_segments: {
      duration_minutes: number;
      service_variation_id: string;
      service_variation_version: number;
      team_member_id: string;
    }[];
    customer_note: string;
    location_id: string;
    location_type: string;
    seller_note: string;
    start_at: string;
  };
}

interface BookingResponse {
  booking: {
    id: string;
    version: number;
    status: string;
    created_at: string;
    updated_at: string;
    location_id: string;
    customer_id: string;
    customer_note: string;
    start_at: string;
    all_day: boolean;
    appointment_segments: {
      duration_minutes: number;
      service_variation_id: string;
      team_member_id: string;
      service_variation_version: number;
      any_team_member: boolean;
      intermission_minutes: number;
    }[];
    seller_note: string;
    transition_time_minutes: number;
    creator_details: {
      creator_type: string;
      team_member_id: string;
    };
    source: string;
    location_type: string;
  };
  errors: any[];
}

export type { BarberProfile, BookingRequest, BookingResponse, AvailabilityRequest, AvailabilityQuery, AvailabilityResponse, BusinessBookingProfileResponse, CustomerRequest, ServicesResponse, BarberResponse, CustomerResponse };
