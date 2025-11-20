import type { ApiResponse, Payment } from '../../types/api';
import instance from '../util/instance';

// 거래 내역 전체 조회
export const getPaymentsList = async (): Promise<ApiResponse<Payment[]>> => {
    const response = await instance.get('/payments/list');
    return response.data;
};
