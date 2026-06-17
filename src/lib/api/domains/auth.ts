import { apiRequest } from '../request';

export const authApi = {
  async login(credentials: { email: string; password: string }): Promise<unknown> {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async logout(): Promise<void> {
    await apiRequest('/auth/logout', { method: 'POST' });
  },

  async getProfile(): Promise<unknown> {
    return apiRequest('/auth/profile');
  },
};
