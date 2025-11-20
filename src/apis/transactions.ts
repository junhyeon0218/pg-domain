// src/apis/transactions.ts
import client from './client';
import { Transaction } from '../types';

interface GetTransactionsParams {
  startDate: string;
  endDate: string;
  page?: number;
  size?: number;
  status?: string;
  merchantName?: string;
}

interface GetTransactionsResponse {
  content: Transaction[];
  totalPages: number;
  totalElements: number;
}

export const getTransactions = async (
  params: GetTransactionsParams
): Promise<GetTransactionsResponse> => {
  const response = await client.get('/transactions', { params });
  return response.data;
};
