export interface BookingEventData {
  bookingId: string;
  amount: number;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    isNewCustomer?: boolean;
  };
  teamMember: {
    id: string;
    name: string;
  };
  service: {
    name: string;
    duration: number;
    price: number;
  };
  startAt: string;
  createdAt: string;
  status: string;
  customerNote?: string;
  source?: string;
}

export interface BookingEventProperties {
  booking: {
    id: string;
    amount: number;
    status: string;
    startAt: string;
    createdAt: string;
    customerNote?: string;
    source: string;
  };
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    isNewCustomer?: boolean;
  };
  teamMember: {
    id: string;
    name: string;
  };
  service: {
    name: string;
    duration: number;
    price: number;
  };
  attribution: {
    trafficSource: string;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    fbclid: string | null;
  };
}
