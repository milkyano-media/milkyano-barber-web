import { createContext } from 'react';
import { UserData } from '@/interfaces/AuthInterface';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, user: UserData) => void;
  logout: () => void;
  isLoading: boolean;
  refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);