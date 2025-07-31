import { createContext } from 'react';
import { UserData, LoginResponse } from '@/interfaces/AuthInterface';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, user: UserData) => void;
  logout: () => void;
  isLoading: boolean;
  refreshAccessToken: () => Promise<void>;
  verifyGoogleAuth: (idToken: string) => Promise<any>;
  completeGoogleAuth: (idToken: string, phoneNumber: string) => Promise<LoginResponse>;
  loginWithExistingGoogleUser: (response: any) => Promise<any>;
  verifyAppleAuth: (idToken: string, authorizationCode?: string) => Promise<any>;
  completeAppleAuth: (idToken: string, phoneNumber: string) => Promise<LoginResponse>;
  loginWithExistingAppleUser: (response: any) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);