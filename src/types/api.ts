export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export type PayType = 'ONLINE' | 'DEVICE' | 'MOBILE' | 'VACT' | 'BILLING';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface Payment {
    paymentCode: string;
    mchtCode: string;
    amount: string;
    currency: string;
    payType: PayType;
    status: PaymentStatus;
    paymentAt: string;
}

export interface Merchant {
    mchtCode: string;
    mchtName: string;
    status: string;
    bizType: string; // 업종
}

export interface MerchantDetail extends Merchant {
    bizNo: string; // 사업자 번호
    address: string;
    phone: string;
    email: string;
    registeredAt: string;
    updatedAt: string;
}

export interface CommonCode {
    code: string;
    description: string;
}

export interface PaymentType {
    type: string;
    description: string;
}
