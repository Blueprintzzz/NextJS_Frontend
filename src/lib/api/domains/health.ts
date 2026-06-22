import { apiRequest } from '../request';

export const healthApi = {
  async check(): Promise<boolean> {
    try {
      await apiRequest('/health');
      return true;
    } catch {
      return false;
    }
  },
};
