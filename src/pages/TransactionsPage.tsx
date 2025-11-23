import React, { useEffect, useMemo, useState } from 'react';
import { getPaymentsList } from '../apis/api/payments';
import { getMerchantsList } from '../apis/api/merchants';
import type { Payment, PaymentStatus, PayType, Merchant } from '../types/api';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilter from '../components/transactions/TransactionFilter';
import TransactionPagination from '../components/transactions/TransactionPagination';

const ITEMS_PER_PAGE = 20;

const TransactionsPage: React.FC = () => {
    // 거래내역/가맹점 이름
    const [allPayments, setAllPayments] = useState<Payment[]>([]);
    const [merchantNameMap, setMerchantNameMap] = useState<Record<string, string>>({});

    // 로딩/에러
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 필터링 값
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | ''>('');
    const [selectedPayType, setSelectedPayType] = useState<PayType | ''>('');

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [paymentsRes, merchantsRes] = await Promise.all([getPaymentsList(), getMerchantsList()]);

                if (paymentsRes.status === 200 && paymentsRes.data) {
                    const sortedPayments = paymentsRes.data.sort(
                        (a, b) => new Date(b.paymentAt).getTime() - new Date(a.paymentAt).getTime(),
                    );
                    setAllPayments(sortedPayments);
                } else {
                    throw new Error(paymentsRes.message || 'Failed to fetch payments');
                }
                // 가맹점 코드랑 이름 매칭
                if (merchantsRes.status === 200 && merchantsRes.data) {
                    const newNameMap = Object.fromEntries(merchantsRes.data.map((m) => [m.mchtCode, m.mchtName]));
                    setMerchantNameMap(newNameMap);
                } else {
                    throw new Error(merchantsRes.message || 'Failed to fetch merchants');
                }
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredPayments = useMemo(() => {
        setCurrentPage(1);

        return allPayments.filter((payment) => {
            const merchantName = merchantNameMap[payment.mchtCode] || '';
            const matchesSearch =
                merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                payment.paymentCode.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = selectedStatus ? payment.status === selectedStatus : true;
            const matchesPayType = selectedPayType ? payment.payType === selectedPayType : true;

            return matchesSearch && matchesStatus && matchesPayType;
        });
    }, [allPayments, searchQuery, selectedStatus, selectedPayType, merchantNameMap]);

    const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
    const paginatedPayments = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
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
                    <TransactionTable payments={paginatedPayments} merchantNameMap={merchantNameMap} />
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
