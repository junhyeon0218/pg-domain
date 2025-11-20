import React, { useEffect, useState } from 'react';
import { getPaymentStatus, getPaymentType } from '../../apis/api/common';
import type { CommonCode, PaymentStatus, PaymentType, PayType } from '../../types/api';

interface TransactionFilterProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedStatus: PaymentStatus | '';
    setSelectedStatus: (status: PaymentStatus | '') => void;
    selectedPayType: PayType | '';
    setSelectedPayType: (payType: PayType | '') => void;
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedPayType,
    setSelectedPayType,
}) => {
    const [statuses, setStatuses] = useState<CommonCode[]>([]);
    const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const statusRes = await getPaymentStatus();
                if (statusRes.status === 200) {
                    setStatuses(statusRes.data);
                }
                const typeRes = await getPaymentType();
                if (typeRes.status === 200) {
                    setPaymentTypes(typeRes.data);
                }
            } catch (error) {
                console.error('Failed to fetch filter options:', error);
            }
        };
        fetchFilterOptions();
    }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                        검색
                    </label>
                    <input
                        type="text"
                        id="search"
                        placeholder="주문번호, 가맹점 코드 등"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        결제 상태
                    </label>
                    <select
                        id="status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as PaymentStatus | '')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white shadow-sm border-1 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="">전체</option>
                        {statuses.map((status) => (
                            <option key={status.code} value={status.code}>
                                {status.description}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700">
                        결제 수단
                    </label>
                    <select
                        id="paymentType"
                        value={selectedPayType}
                        onChange={(e) => setSelectedPayType(e.target.value as PayType | '')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base shadow-sm border-1 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="">전체</option>
                        {paymentTypes.map((type) => (
                            <option key={type.type} value={type.type}>
                                {type.description}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        기간
                    </label>
                    <input
                        type="text"
                        id="date"
                        placeholder="YYYY-MM-DD ~ YYYY-MM-DD"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default TransactionFilter;
