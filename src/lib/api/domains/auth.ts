import type { AuthResponse } from '@/features/auth/types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const authApi = {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: 'TOURIST' | 'DRIVER';
  }): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? 'Registration failed');
    }
    return res.json();
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? 'Login failed');
    }
    return res.json();
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new Error('Token refresh failed');
    return res.json();
  },

  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });
  },

  async me(accessToken: string): Promise<AuthResponse['user']> {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },
};
