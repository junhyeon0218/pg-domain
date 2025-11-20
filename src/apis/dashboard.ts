import client from './client';
import { DashboardData } from '../types';

export const getDashboardData = async (startDate: string, endDate: string): Promise<DashboardData> => {
  const response = await client.get('/dashboard', {
    params: { startDate, endDate },
  });
  return response.data;
};
