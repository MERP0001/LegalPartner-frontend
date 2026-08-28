import type { User } from '@/types';
import { apiClient } from './client';

export type LoginResponse = {
  success: boolean;
  message?: string;
  requires_verification?: boolean;
  email?: string;
  tokens?: { refresh: string; access: string };
  user?: User;
};

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await apiClient.post('/api/auth/login/', { email, password });
  return res.data;
}

export type RegisterResponse = {
  success: boolean;
  message?: string;
  requires_verification?: boolean;
  user?: User;
  tokens?: { refresh: string; access: string };
  errors?: unknown;
};

export async function apiRegister(data: {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  organization?: string;
}): Promise<RegisterResponse> {
  const res = await apiClient.post('/api/auth/register/', data);
  return res.data as RegisterResponse;
}

export async function apiVerifyEmail(key: string): Promise<{ success: boolean; message?: string; email?: string }> {
  const res = await apiClient.post('/api/auth/verify-email/', { key });
  return res.data;
}

export async function apiResendVerification(email: string): Promise<{ success: boolean; message?: string }> {
  const res = await apiClient.post('/api/auth/resend-verification/', { email });
  return res.data;
}

