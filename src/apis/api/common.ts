import type { ApiResponse, CommonCode, PaymentType } from '../../types/api';
import instance from '../util/instance';

// 결제 상태 코드 조회
export const getPaymentStatus = async (): Promise<ApiResponse<CommonCode[]>> => {
    const response = await instance.get('/common/payment-status/all');
    return response.data;
};

// 결제 수단 코드 조회 (payment x -> paymemt o 오타가 있는듯 하다)
export const getPaymentType = async (): Promise<ApiResponse<PaymentType[]>> => {
    const response = await instance.get('/common/paymemt-type/all');
    return response.data;
};

// 가맹점 상태 코드 조회
export const getMchtStatus = async (): Promise<ApiResponse<CommonCode[]>> => {
    const response = await instance.get('/common/mcht-status/all');
    return response.data;
};
