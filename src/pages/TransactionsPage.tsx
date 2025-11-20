import React, { useEffect, useMemo, useState } from 'react';
import { getPaymentsList } from '../apis/api/payments';
import type { Payment, PaymentStatus, PayType } from '../types/api';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilter from '../components/transactions/TransactionFilter';
import TransactionPagination from '../components/transactions/TransactionPagination';

const ITEMS_PAGE = 20;

const TransactionsPage: React.FC = () => {
    // 전체 거래내역
    const [allPayments, setAllPayments] = useState<Payment[]>([]);

    // 로딩/에러
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 필터
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | ''>('');
    const [selectedPayType, setSelectedPayType] = useState<PayType | ''>('');

    // 페이지
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const response = await getPaymentsList();
                if (response.status === 200 && response.data) {
                    setAllPayments(response.data);
                } else {
                    setError(response.message || 'Failed to fetch data');
                }
            } catch (err) {
                setError('An unexpected error occurred.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const filteredPayments = useMemo(() => {
        // 필터 변경하면 1페이지로 이동
        setCurrentPage(1);

        return allPayments.filter((payment) => {
            // 검색
            const matchesSearch =
                payment.mchtCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                payment.paymentCode.toLowerCase().includes(searchQuery.toLowerCase());

            // 결제 상태
            const matchesStatus = selectedStatus ? payment.status === selectedStatus : true;

            // 결제 수단
            const matchesPayType = selectedPayType ? payment.payType === selectedPayType : true;

            return matchesSearch && matchesStatus && matchesPayType;
        });
    }, [allPayments, searchQuery, selectedStatus, selectedPayType]);

    // 페이지네이션
    const totalPages = Math.ceil(filteredPayments.length / ITEMS_PAGE);
    const paginatedPayments = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PAGE;
        const endIndex = startIndex + ITEMS_PAGE;
        return filteredPayments.slice(startIndex, endIndex);
    }, [filteredPayments, currentPage]);

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">거래 내역</h1>

            <TransactionFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedPayType={selectedPayType}
                setSelectedPayType={setSelectedPayType}
            />

            {loading && <p>로딩 중...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <>
                    <TransactionTable payments={paginatedPayments} />
                    <TransactionPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default TransactionsPage;
