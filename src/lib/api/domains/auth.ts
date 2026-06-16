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

  async switchOrg(orgId: string): Promise<unknown> {
    return apiRequest('/auth/switch-org', {
      method: 'POST',
      body: JSON.stringify({ orgId }),
    });
  },

  async getProfile(): Promise<unknown> {
    return apiRequest('/auth/profile');
  },
};
