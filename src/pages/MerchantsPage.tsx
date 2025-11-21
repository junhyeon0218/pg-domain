import React, { useEffect, useMemo, useState } from 'react';
import { getMerchantsList } from '../apis/api/merchants';
import { getMchtStatus } from '../apis/api/common';
import type { Merchant, CommonCode } from '../types/api';
import MerchantsTable from '../components/merchants/MerchantsTable';
import MerchantsFilter from '../components/merchants/MerchantsFilter';
import TransactionPagination from '../components/transactions/TransactionPagination';

const ITEMS_PER_PAGE = 20; // 페이지네이션 상수

const MerchantsPage: React.FC = () => {
    const [allMerchants, setAllMerchants] = useState<Merchant[]>([]);
    const [statusMap, setStatusMap] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 필터 관련 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // 페이지네이션 관련 상태
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 가맹점 목록과 상태 목록 조회
                const [merchantsRes, statusesRes] = await Promise.all([getMerchantsList(), getMchtStatus()]);

                if (merchantsRes.status === 200 && merchantsRes.data) {
                    setAllMerchants(merchantsRes.data);
                } else {
                    throw new Error(merchantsRes.message || 'Failed to fetch merchants');
                }

                if (statusesRes.status === 200 && statusesRes.data) {
                    const newStatusMap = statusesRes.data.reduce((acc: Record<string, string>, status: CommonCode) => {
                        acc[status.code] = status.description;
                        return acc;
                    }, {});
                    setStatusMap(newStatusMap);
                } else {
                    throw new Error(statusesRes.message || 'Failed to fetch statuses');
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

    // 메모이제이션된 필터링 로직
    const filteredMerchants = useMemo(() => {
        setCurrentPage(1); // 필터 변경 시 1페이지로 리셋
        return allMerchants.filter((merchant) => {
            // 검색어 필터링(가맹점명)
            const matchesSearch = merchant.mchtName.toLowerCase().includes(searchQuery.toLowerCase());

            // 상태 필터링
            const matchesStatus = selectedStatus ? merchant.status === selectedStatus : true;

            return matchesSearch && matchesStatus;
        });
    }, [allMerchants, searchQuery, selectedStatus]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredMerchants.length / ITEMS_PER_PAGE);
    const paginatedMerchants = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredMerchants.slice(startIndex, endIndex);
    }, [filteredMerchants, currentPage]);

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">가맹점 조회</h1>

            <MerchantsFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
            />

            {loading && <p>로딩 중...</p>}
            {error && <p className="text-red-500">에러: {error}</p>}

            {!loading && !error && (
                <>
                    <MerchantsTable merchants={paginatedMerchants} statusMap={statusMap} />
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

export default MerchantsPage;
