'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CryptoJS from 'crypto-js';
import axios, { AxiosResponse } from 'axios';
import { User, AuthContextType, LoginResult } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Encryption key
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'dfhdfjftdtryudfhd';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Encryption utilities
  const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  };

  const decryptData = (encryptedData: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    const checkAuth = (): void => {
      try {
        const encryptedToken = localStorage.getItem('token');
        const encryptedEmail = localStorage.getItem('email');
        const encryptedPassword = localStorage.getItem('password');
        const encryptedPasswordChanged = localStorage.getItem('passwordChanged');
        const encryptedUserData = localStorage.getItem('userData');

        if (encryptedToken) {
          const token = decryptData(encryptedToken);
          const email = encryptedEmail ? decryptData(encryptedEmail) : '';
          const password = encryptedPassword ? decryptData(encryptedPassword) : '';
          const passwordChanged = encryptedPasswordChanged ? decryptData(encryptedPasswordChanged) === 'true' : false;
          const userData = encryptedUserData ? JSON.parse(decryptData(encryptedUserData)) : {};

          setUser({ ...userData, email, password, token, password_changed: passwordChanged });
        }
      } catch (error) {
        console.error('Error decrypting auth data:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.removeItem('passwordChanged');
        localStorage.removeItem('userData');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response: AxiosResponse = await axios.post(`${baseUrl}/users/users/login-user/`, {
        email,
        password,
      });

      const data = response.data;
      const userData: User = data.user_data || data.user;
      const token = data.token;
      const passwordChanged = data.password_changed;

      // Encrypt and store data
      const encryptedToken = encryptData(token);
      const encryptedEmail = encryptData(email);
      const encryptedPassword = encryptData(password);
      const encryptedPasswordChanged = encryptData(passwordChanged.toString());
      const encryptedUserData = encryptData(JSON.stringify(userData));

      localStorage.setItem('token', encryptedToken);
      localStorage.setItem('email', encryptedEmail);
      localStorage.setItem('password', encryptedPassword);
      localStorage.setItem('passwordChanged', encryptedPasswordChanged);
      localStorage.setItem('userData', encryptedUserData);

      setUser({ ...userData, token, email, password, password_changed: passwordChanged });
      return { success: true, message: data.info || 'Login successful', password_changed: passwordChanged };
    } catch (error: any) {
      const errorData = error.response?.data;
      return { success: false, error: errorData?.info || 'Login failed' };
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('passwordChanged');
    localStorage.removeItem('userData');
  };

  const refreshToken = async (): Promise<boolean> => {
    
    return !!user;
  };

  const resetPassword = async (email: string, password: string, confirm_password: string): Promise<LoginResult> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response: AxiosResponse = await axios.post(`${baseUrl}/users/users/reset-password/`, { email, password, confirm_password });

      const data = response.data;

      return { success: true, message: data.info || 'Password reset successful' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.info || 'Reset password failed' };
    }
  };

  const sendOTP = async (email: string): Promise<LoginResult> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response: AxiosResponse = await axios.post(`${baseUrl}/users/users/send-otp/`, { email });

      const data = response.data;

      return { success: true, message: data.info || 'OTP sent' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.info || 'Send OTP failed' };
    }
  };

  const verifyOTP = async (otp: string): Promise<LoginResult> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response: AxiosResponse = await axios.post(`${baseUrl}/users/users/verify-otp/`, { otp });

      const data = response.data;
      return { success: true, message: data.info || 'OTP verified' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.info || 'OTP verification failed' };
    }
  };

  const updatePassword = async (password: string, confirm_password: string): Promise<LoginResult> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const token = user?.token ? decryptData(localStorage.getItem('token') || '') : '';
      const email = user?.email || decryptData(localStorage.getItem('email') || '');

      const response: AxiosResponse = await axios.post(`${baseUrl}/users/users/update-password/`, {
        email,
        password,
        confirm_password,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;

      // Update stored password
      const encryptedNewPassword = encryptData(password);
      localStorage.setItem('password', encryptedNewPassword);
      return { success: true, message: data.info || 'Password updated successfully' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.info || 'Update password failed' };
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    refreshToken,
    resetPassword,
    sendOTP,
    verifyOTP,
    updatePassword,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
