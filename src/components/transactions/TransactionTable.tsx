import React from 'react';
import { Link } from 'react-router-dom';
import type { Payment, PaymentStatus, PayType } from '../../types/api';

interface TransactionTableProps {
  payments: Payment[];
  merchantNameMap: Record<string, string>;
}

const statusMap: Record<PaymentStatus, string> = {
  SUCCESS: '결제 완료',
  FAILED: '결제 실패',
  PENDING: '결제 대기',
  CANCELLED: '환불 완료',
};

const payTypeMap: Record<PayType, string> = {
  ONLINE: '온라인',
  DEVICE: '단말기',
  MOBILE: '모바일',
  VACT: '가상계좌',
  BILLING: '정기결제',
};

const getStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case 'SUCCESS':
      return 'bg-green-100 text-green-800';
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TransactionTable: React.FC<TransactionTableProps> = ({ payments, merchantNameMap }) => {
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결제일시</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가맹점명</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문번호</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결제수단</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.paymentCode} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(payment.paymentAt)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link to={`/merchants/${payment.mchtCode}`}>
                  <div className="text-gray-900 font-medium">{merchantNameMap[payment.mchtCode] || '알 수 없음'}</div>
                  <div className="text-gray-500">{payment.mchtCode}</div>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.paymentCode}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payTypeMap[payment.payType] || payment.payType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(payment.amount)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(payment.status)}`}>
                  {statusMap[payment.status] || payment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
