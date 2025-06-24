import { createContext } from 'react';
import { CustomerDetail } from '@/interfaces/BookingInterface';

export interface AuthContextType {
  isAuthenticated: boolean;
  customer: CustomerDetail | null;
  authToken: string | null;
  login: (token: string, customer: CustomerDetail) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);