export interface Transaction {
  id: string;
  orderedAt: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  paymentMethod: 'CARD' | 'BANK_TRANSFER' | 'EASY_PAY';
  merchantName: string;
  orderId: string;
}

export interface Merchant {
  id: string;
  name: string;
  representative: string;
  email: string;
  dailyAverageAmount: number;
  lastPaymentAt: string;
}

export interface Settlement {
  merchantId: string;
  amount: number;
  settlementDate: string;
  status: 'PENDING' | 'COMPLETED';
}

export interface DashboardData {
  totalAmount: number;
  totalCount: number;
  approvalRate: number;
  failureCount: number;
  cancellationAmount: number;
  settlementAmount: number;
}
