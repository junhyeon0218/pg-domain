import type { ApiResponse, Merchant, MerchantDetail } from '../../types/api';
import instance from '../util/instance';

// 가맹점 목록 조회
export const getMerchantsList = async (): Promise<ApiResponse<Merchant[]>> => {
  const response = await instance.get('/merchants/list');
  return response.data;
};

// 가맹점 상세 조회
export const getMerchantsDetails = async (): Promise<ApiResponse<MerchantDetail[]>> => {
  const response = await instance.get(`/merchants/details`);
  return response.data;
};

// 가맹점 코드로 상세 조회
export const getMerchantsDetailsByCode = async (mchtCode: string): Promise<ApiResponse<MerchantDetail>> => {
  const response = await instance.get(`/merchants/details/${mchtCode}`);
  return response.data;
};
